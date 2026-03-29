from __future__ import annotations

import asyncio
import base64
import json
import mimetypes
import os
import uuid
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Deque

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Response, WebSocket, WebSocketDisconnect, status
from pydantic import BaseModel, ConfigDict, Field, model_validator

load_dotenv(dotenv_path=Path(__file__).with_name(".env"))

app = FastAPI(title="ECG Image STEMI Lava Bridge", version="3.0.0")
MODULE_DIR = Path(__file__).resolve().parent
WORKSPACE_DIR = MODULE_DIR.parent


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def parse_base64_image(raw_value: str) -> tuple[str, str]:
    value = raw_value.strip()
    if not value:
        raise ValueError("ecgImageBase64 cannot be empty")

    media_type = "image/png"
    encoded = value

    if value.startswith("data:"):
        header, separator, payload = value.partition(",")
        if not separator:
            raise ValueError("Invalid data URL image payload")
        if ";base64" not in header:
            raise ValueError("ECG image must be base64 encoded")
        media_type = header.removeprefix("data:").split(";")[0] or media_type
        encoded = payload

    try:
        base64.b64decode(encoded, validate=True)
    except Exception as exc:
        raise ValueError("ecgImageBase64 must contain valid base64 data") from exc

    return media_type, encoded


def as_data_url(image_base64: str) -> str:
    media_type, encoded = parse_base64_image(image_base64)
    return f"data:{media_type};base64,{encoded}"


def resolve_image_path(image_path: str) -> Path:
    value = image_path.strip()
    if not value:
        raise ValueError("ecgImagePath cannot be empty")

    candidate = Path(value)
    possible_paths: list[Path] = []

    if candidate.is_absolute():
        possible_paths.append(candidate.resolve())
    else:
        possible_paths.extend(
            [
                (Path.cwd() / candidate).resolve(),
                (WORKSPACE_DIR / candidate).resolve(),
                (MODULE_DIR / candidate).resolve(),
            ]
        )

    seen: set[str] = set()
    for path in possible_paths:
        normalized = str(path)
        if normalized in seen:
            continue
        seen.add(normalized)
        if path.exists() and path.is_file():
            return path

    raise ValueError(f"ecgImagePath does not resolve to a file: {image_path}")


def data_url_from_image_path(image_path: str) -> str:
    resolved_path = resolve_image_path(image_path)
    guessed_type, _ = mimetypes.guess_type(str(resolved_path))
    media_type = guessed_type if guessed_type and guessed_type.startswith("image/") else "image/png"

    try:
        image_bytes = resolved_path.read_bytes()
    except OSError as exc:
        raise ValueError(f"Unable to read ECG image file: {resolved_path}") from exc

    if not image_bytes:
        raise ValueError(f"ECG image file is empty: {resolved_path}")

    encoded = base64.b64encode(image_bytes).decode("ascii")
    return f"data:{media_type};base64,{encoded}"


def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise HTTPException(
            status_code=500,
            detail=f"Missing required environment variable: {name}",
        )
    return value


def get_lava_chat_completions_url() -> str:
    configured = os.getenv("LAVA_CHAT_COMPLETIONS_URL", "").strip()
    if configured:
        return configured
    return "https://api.lava.so/v1/chat/completions"


def parse_confidence_threshold() -> float:
    raw = os.getenv("STEMI_CONFIDENCE_THRESHOLD", "0.80")
    try:
        value = float(raw)
    except ValueError as exc:
        raise HTTPException(
            status_code=500,
            detail="STEMI_CONFIDENCE_THRESHOLD must be numeric",
        ) from exc
    if value < 0 or value > 1:
        raise HTTPException(
            status_code=500,
            detail="STEMI_CONFIDENCE_THRESHOLD must be between 0 and 1",
        )
    return value


def parse_model_content(raw_content: Any) -> dict[str, Any]:
    if isinstance(raw_content, dict):
        return raw_content

    if isinstance(raw_content, str):
        try:
            parsed = json.loads(raw_content)
            if isinstance(parsed, dict):
                return parsed
            return {"rawContent": raw_content}
        except json.JSONDecodeError:
            return {"rawContent": raw_content}

    if isinstance(raw_content, list):
        text_parts: list[str] = []
        for item in raw_content:
            if isinstance(item, dict) and isinstance(item.get("text"), str):
                text_parts.append(item["text"])
            elif isinstance(item, str):
                text_parts.append(item)

        joined = "".join(text_parts).strip()
        if not joined:
            return {"rawContent": raw_content}

        try:
            parsed = json.loads(joined)
            if isinstance(parsed, dict):
                return parsed
            return {"rawContent": joined}
        except json.JSONDecodeError:
            return {"rawContent": joined}

    return {"rawContent": raw_content}


def as_bool(value: Any) -> bool | None:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        lowered = value.strip().lower()
        if lowered in {"true", "yes", "1"}:
            return True
        if lowered in {"false", "no", "0"}:
            return False
    return None


def as_float(value: Any) -> float | None:
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return None
    return None


class EmergencyPushPayload(BaseModel):
    emergencyId: str = Field(default_factory=lambda: f"emergency-{uuid.uuid4().hex[:12]}")
    victimFirstName: str = "Unknown"
    distanceMeters: float | str | None = None
    latitude: float | str | None = None
    longitude: float | str | None = None


class ECGImageAnalyzeRequest(BaseModel):
    model_config = ConfigDict(extra="allow")

    ecgId: str
    patientId: str | None = None
    capturedAt: datetime = Field(default_factory=utc_now)
    ecgImageBase64: str | None = None
    ecgImagePath: str | None = None
    targetDeviceIds: list[str] = Field(default_factory=list)
    emergencyPayload: EmergencyPushPayload | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    @model_validator(mode="after")
    def validate_image_source(self) -> ECGImageAnalyzeRequest:
        has_base64 = bool(self.ecgImageBase64 and self.ecgImageBase64.strip())
        has_path = bool(self.ecgImagePath and self.ecgImagePath.strip())

        if has_base64 == has_path:
            raise ValueError("Provide exactly one of ecgImageBase64 or ecgImagePath")

        if has_base64 and self.ecgImageBase64 is not None:
            parse_base64_image(self.ecgImageBase64)

        if has_path and self.ecgImagePath is not None:
            resolve_image_path(self.ecgImagePath)

        return self


class ModelAssessment(BaseModel):
    stemiPresent: bool
    confidence: float | None = None
    reasoning: str
    leadFindings: list[str] = Field(default_factory=list)
    recommendation: str | None = None


class ECGImageAnalyzeResponse(BaseModel):
    modelName: str
    lavaRequestId: str | None = None
    analyzedAt: datetime
    stemiPresent: bool
    confidence: float | None = None
    confidenceThreshold: float
    emergencyTriggered: bool
    dispatchAttempted: bool
    dispatchSkippedReason: str | None = None
    deliveredToConnected: list[str] = Field(default_factory=list)
    queuedForPolling: list[str] = Field(default_factory=list)
    modelAssessment: ModelAssessment
    modelOutput: dict[str, Any] = Field(default_factory=dict)


class TestAlertDispatchRequest(BaseModel):
    targetDeviceIds: list[str] = Field(..., min_length=1)
    title: str = "Possible STEMI detected"
    body: str = "Possible ST-elevation myocardial infarction detected from ECG image."
    emergencyPayload: EmergencyPushPayload | None = None
    extra: dict[str, Any] = Field(default_factory=dict)


class TestAlertDispatchResponse(BaseModel):
    deliveredToConnected: list[str] = Field(default_factory=list)
    queuedForPolling: list[str] = Field(default_factory=list)


class DeviceChannelManager:
    def __init__(self) -> None:
        self._websockets: dict[str, set[WebSocket]] = defaultdict(set)
        self._pending_alerts: dict[str, Deque[dict[str, Any]]] = defaultdict(deque)
        self._lock = asyncio.Lock()

    async def connect(self, device_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._websockets[device_id].add(websocket)

    async def disconnect(self, device_id: str, websocket: WebSocket) -> None:
        async with self._lock:
            sockets = self._websockets.get(device_id)
            if sockets is None:
                return
            sockets.discard(websocket)
            if not sockets:
                self._websockets.pop(device_id, None)

    async def dispatch(
        self,
        target_device_ids: list[str],
        payload: dict[str, Any],
    ) -> tuple[list[str], list[str]]:
        delivered: list[str] = []
        queued: list[str] = []

        for device_id in dict.fromkeys(target_device_ids):
            was_delivered = await self._send_or_queue(device_id=device_id, payload=dict(payload))
            if was_delivered:
                delivered.append(device_id)
            else:
                queued.append(device_id)

        return delivered, queued

    async def _send_or_queue(self, device_id: str, payload: dict[str, Any]) -> bool:
        async with self._lock:
            sockets = list(self._websockets.get(device_id, set()))

        if not sockets:
            async with self._lock:
                self._pending_alerts[device_id].append(payload)
            return False

        delivered = False
        stale_sockets: list[WebSocket] = []

        for websocket in sockets:
            try:
                await websocket.send_json(payload)
                delivered = True
            except Exception:
                stale_sockets.append(websocket)

        if stale_sockets:
            async with self._lock:
                active = self._websockets.get(device_id)
                if active is not None:
                    for socket in stale_sockets:
                        active.discard(socket)
                    if not active:
                        self._websockets.pop(device_id, None)

        if delivered:
            return True

        async with self._lock:
            self._pending_alerts[device_id].append(payload)
        return False

    async def pop_next_alert(self, device_id: str) -> dict[str, Any] | None:
        async with self._lock:
            queue = self._pending_alerts.get(device_id)
            if not queue:
                return None
            alert = queue.popleft()
            if not queue:
                self._pending_alerts.pop(device_id, None)
            return alert

    async def pending_count(self, device_id: str) -> int:
        async with self._lock:
            queue = self._pending_alerts.get(device_id)
            return len(queue) if queue else 0


device_channels = DeviceChannelManager()


def normalize_assessment(model_output: dict[str, Any]) -> ModelAssessment:
    stemi_candidate_values = [
        model_output.get("stemi_present"),
        model_output.get("stemiPresent"),
        model_output.get("st_elevation_mi_present"),
        model_output.get("heart_attack_predicted"),
    ]
    stemi_present = False
    for candidate in stemi_candidate_values:
        parsed = as_bool(candidate)
        if parsed is not None:
            stemi_present = parsed
            break

    confidence = as_float(
        model_output.get("confidence")
        if model_output.get("confidence") is not None
        else model_output.get("stemi_confidence")
    )
    if confidence is not None:
        confidence = max(0.0, min(1.0, confidence))

    reasoning_raw = model_output.get("reasoning")
    if not isinstance(reasoning_raw, str) or not reasoning_raw.strip():
        reasoning_raw = "Model did not provide an explanation."

    lead_findings_raw = model_output.get("lead_findings")
    lead_findings: list[str] = []
    if isinstance(lead_findings_raw, list):
        for finding in lead_findings_raw:
            if isinstance(finding, str) and finding.strip():
                lead_findings.append(finding.strip())

    recommendation = model_output.get("recommendation")
    recommendation_value = recommendation.strip() if isinstance(recommendation, str) else None

    return ModelAssessment(
        stemiPresent=stemi_present,
        confidence=confidence,
        reasoning=reasoning_raw.strip(),
        leadFindings=lead_findings,
        recommendation=recommendation_value,
    )


def request_image_data_url(request: ECGImageAnalyzeRequest) -> str:
    if request.ecgImageBase64 and request.ecgImageBase64.strip():
        return as_data_url(request.ecgImageBase64)

    if request.ecgImagePath and request.ecgImagePath.strip():
        return data_url_from_image_path(request.ecgImagePath)

    raise HTTPException(
        status_code=422,
        detail="Provide exactly one of ecgImageBase64 or ecgImagePath",
    )


async def call_lava_gemini(
    request: ECGImageAnalyzeRequest,
) -> tuple[str, str | None, dict[str, Any], ModelAssessment]:
    api_key = require_env("LAVA_API_KEY")
    chat_completions_url = get_lava_chat_completions_url()
    model_name = os.getenv("LAVA_MODEL_NAME", "gemini-3.1-pro-preview")

    instruction_payload = {
        "task": "Review ECG image and decide whether ST-segment elevation consistent with acute myocardial infarction is present.",
        "ecgId": request.ecgId,
        "patientId": request.patientId,
        "capturedAt": request.capturedAt.isoformat(),
        "metadata": request.metadata,
        "requiredOutput": {
            "stemi_present": "boolean",
            "confidence": "number from 0 to 1",
            "reasoning": "string",
            "lead_findings": "array of strings",
            "recommendation": "string",
        },
    }

    request_body = {
        "model": model_name,
        "temperature": 0,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are assisting emergency triage. "
                    "Only return valid JSON matching the requested schema. "
                    "Do not include markdown."
                ),
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": json.dumps(instruction_payload)},
                    {
                        "type": "text",
                        "text": (
                            "Check for ST-segment elevation patterns that are suggestive "
                            "of myocardial infarction in the ECG image."
                        ),
                    },
                    {"type": "image_url", "image_url": {"url": request_image_data_url(request)}},
                ],
            },
        ],
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(chat_completions_url, headers=headers, json=request_body)
            response.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Lava API request failed: {exc}") from exc

    lava_json = response.json()
    lava_request_id = lava_json.get("id") if isinstance(lava_json, dict) else None

    model_output: dict[str, Any] = {}
    if isinstance(lava_json, dict):
        choices = lava_json.get("choices")
        if isinstance(choices, list) and choices:
            first_choice = choices[0]
            if isinstance(first_choice, dict):
                message = first_choice.get("message")
                if isinstance(message, dict):
                    model_output = parse_model_content(message.get("content"))

    assessment = normalize_assessment(model_output)
    return model_name, lava_request_id, model_output, assessment


def should_trigger_alert(assessment: ModelAssessment, threshold: float) -> bool:
    if not assessment.stemiPresent:
        return False
    if assessment.confidence is None:
        return True
    return assessment.confidence >= threshold


def build_stemi_alert_payload(
    request: ECGImageAnalyzeRequest,
    assessment: ModelAssessment,
) -> dict[str, Any]:
    emergency = request.emergencyPayload or EmergencyPushPayload()
    confidence_text = "unknown"
    if assessment.confidence is not None:
        confidence_text = f"{assessment.confidence:.2f}"

    return {
        "type": "stemi_alert",
        "emergencyId": emergency.emergencyId,
        "victimFirstName": emergency.victimFirstName,
        "distanceMeters": emergency.distanceMeters,
        "latitude": emergency.latitude,
        "longitude": emergency.longitude,
        "ecgId": request.ecgId,
        "title": "Possible STEMI detected",
        "body": (
            "Possible ST-elevation myocardial infarction detected on ECG "
            f"{request.ecgId} (confidence {confidence_text})."
        ),
        "confidence": assessment.confidence,
        "reasoning": assessment.reasoning,
        "leadFindings": assessment.leadFindings,
        "detectedAt": utc_now().isoformat(),
    }


@app.get("/health")
async def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "model": os.getenv("LAVA_MODEL_NAME", "gemini-3.1-pro-preview"),
        "stemiConfidenceThreshold": parse_confidence_threshold(),
    }


@app.websocket("/api/v1/devices/{device_id}/ws")
async def device_websocket(websocket: WebSocket, device_id: str) -> None:
    await device_channels.connect(device_id, websocket)
    try:
        while True:
            message = await websocket.receive_text()
            if message.strip().lower() == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        pass
    finally:
        await device_channels.disconnect(device_id, websocket)


@app.get("/api/v1/devices/{device_id}/alerts/next")
async def get_next_alert(device_id: str, response: Response) -> dict[str, Any] | None:
    alert = await device_channels.pop_next_alert(device_id)
    if alert is None:
        response.status_code = status.HTTP_204_NO_CONTENT
        return None
    return alert


@app.get("/api/v1/devices/{device_id}/alerts/pending")
async def get_pending_alert_count(device_id: str) -> dict[str, int]:
    return {"pending": await device_channels.pending_count(device_id)}


@app.post("/api/v1/alerts/test", response_model=TestAlertDispatchResponse)
async def dispatch_test_alert(request: TestAlertDispatchRequest) -> TestAlertDispatchResponse:
    emergency = request.emergencyPayload or EmergencyPushPayload(victimFirstName="Alex")
    payload = {
        "type": "stemi_alert_test",
        "emergencyId": emergency.emergencyId,
        "victimFirstName": emergency.victimFirstName,
        "distanceMeters": emergency.distanceMeters,
        "latitude": emergency.latitude,
        "longitude": emergency.longitude,
        "title": request.title,
        "body": request.body,
        "detectedAt": utc_now().isoformat(),
        **request.extra,
    }
    delivered, queued = await device_channels.dispatch(request.targetDeviceIds, payload)
    return TestAlertDispatchResponse(deliveredToConnected=delivered, queuedForPolling=queued)


@app.post("/api/v1/ecg/image-analyze", response_model=ECGImageAnalyzeResponse)
async def analyze_ecg_image(request: ECGImageAnalyzeRequest) -> ECGImageAnalyzeResponse:
    threshold = parse_confidence_threshold()
    model_name, lava_request_id, model_output, assessment = await call_lava_gemini(request)

    emergency_triggered = should_trigger_alert(assessment, threshold)
    dispatch_attempted = False
    dispatch_skipped_reason: str | None = None
    delivered: list[str] = []
    queued: list[str] = []

    if emergency_triggered:
        if request.targetDeviceIds:
            dispatch_attempted = True
            alert_payload = build_stemi_alert_payload(request=request, assessment=assessment)
            delivered, queued = await device_channels.dispatch(request.targetDeviceIds, alert_payload)
        else:
            dispatch_skipped_reason = (
                "STEMI detected, but no targetDeviceIds were provided for local alert delivery."
            )

    return ECGImageAnalyzeResponse(
        modelName=model_name,
        lavaRequestId=lava_request_id,
        analyzedAt=utc_now(),
        stemiPresent=assessment.stemiPresent,
        confidence=assessment.confidence,
        confidenceThreshold=threshold,
        emergencyTriggered=emergency_triggered,
        dispatchAttempted=dispatch_attempted,
        dispatchSkippedReason=dispatch_skipped_reason,
        deliveredToConnected=delivered,
        queuedForPolling=queued,
        modelAssessment=assessment,
        modelOutput=model_output,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
