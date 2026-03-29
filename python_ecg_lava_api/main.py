from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, HttpUrl

load_dotenv(dotenv_path=Path(__file__).with_name(".env"))

app = FastAPI(title="ECG STEMI Alert API", version="1.0.0")


class AppleHealthKitSingleLeadECG(BaseModel):
    record_id: str = Field(..., description="Unique ECG record identifier from HealthKit")
    measured_at: datetime = Field(..., description="Timestamp of ECG capture")
    lead_label: str = Field(default="I", description="Single lead label from Apple Watch")
    sampling_rate_hz: float = Field(..., gt=0)
    voltage_samples_mv: list[float] = Field(..., min_length=1)


class ContiguousLeadGroup(BaseModel):
    lead_names: list[str] = Field(
        ..., min_length=2, description="Contiguous lead names from upstream processing"
    )
    st_elevation_mm: float = Field(..., ge=0)


class ECGInferenceRequest(BaseModel):
    patient_id: str
    ecg: AppleHealthKitSingleLeadECG
    derived_contiguous_lead_groups: list[ContiguousLeadGroup] = Field(default_factory=list)
    paired_iphone_apn_endpoint: HttpUrl
    healthkit_payload_placeholder: dict[str, Any] | None = Field(
        default=None,
        description="Optional raw HealthKit payload shape if already available upstream",
    )


class ECGInferenceResponse(BaseModel):
    model_name: str
    lava_request_id: str | None = None
    rule_triggered: bool
    model_triggered: bool | None = None
    heart_attack_predicted: bool
    apn_sent: bool
    apn_status_code: int | None = None
    apn_response: dict[str, Any] | str | None = None
    model_output: dict[str, Any] = Field(default_factory=dict)


def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise HTTPException(
            status_code=500,
            detail=f"Missing required environment variable: {name}",
        )
    return value


def stemi_rule_triggered(lead_groups: list[ContiguousLeadGroup]) -> bool:
    return any(group.st_elevation_mm > 2.0 and len(group.lead_names) >= 2 for group in lead_groups)


def parse_model_content(raw_content: Any) -> dict[str, Any]:
    if isinstance(raw_content, str):
        try:
            parsed = json.loads(raw_content)
            if isinstance(parsed, dict):
                return parsed
            return {"raw_content": raw_content}
        except json.JSONDecodeError:
            return {"raw_content": raw_content}

    if isinstance(raw_content, list):
        text_parts: list[str] = []
        for item in raw_content:
            if isinstance(item, dict) and isinstance(item.get("text"), str):
                text_parts.append(item["text"])
        joined = "".join(text_parts).strip()
        if not joined:
            return {"raw_content": raw_content}
        try:
            parsed = json.loads(joined)
            if isinstance(parsed, dict):
                return parsed
            return {"raw_content": joined}
        except json.JSONDecodeError:
            return {"raw_content": joined}

    return {"raw_content": raw_content}


async def call_lava_gemini(
    request: ECGInferenceRequest,
    rule_triggered: bool,
) -> tuple[str, str | None, dict[str, Any], bool | None]:
    api_key = require_env("LAVA_API_KEY")
    chat_completions_url = os.getenv(
        "LAVA_CHAT_COMPLETIONS_URL",
        "https://lava-api.example.com/v1/chat/completions",
    )
    model_name = os.getenv("LAVA_MODEL_NAME", "gemini-3.1-pro-preview")

    prompt_payload = {
        "patient_id": request.patient_id,
        "ecg": request.ecg.model_dump(mode="json"),
        "derived_contiguous_lead_groups": [
            group.model_dump(mode="json") for group in request.derived_contiguous_lead_groups
        ],
        "rule": "Predict true only when ST-segment elevation is > 2.0 mm in contiguous leads.",
        "rule_precheck_triggered": rule_triggered,
    }

    request_body = {
        "model": model_name,
        "temperature": 0,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "system",
                "content": (
                    "Return JSON only. Keys: heart_attack_predicted (boolean), "
                    "reasoning (string)."
                ),
            },
            {
                "role": "user",
                "content": json.dumps(prompt_payload),
            },
        ],
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                chat_completions_url,
                headers=headers,
                json=request_body,
            )
            response.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Lava API request failed: {exc}") from exc

    lava_json = response.json()
    lava_request_id = lava_json.get("id") if isinstance(lava_json, dict) else None

    model_output: dict[str, Any] = {}
    model_triggered: bool | None = None

    if isinstance(lava_json, dict):
        choices = lava_json.get("choices")
        if isinstance(choices, list) and choices:
            first_choice = choices[0]
            if isinstance(first_choice, dict):
                message = first_choice.get("message")
                if isinstance(message, dict):
                    parsed = parse_model_content(message.get("content"))
                    model_output = parsed
                    predicted = parsed.get("heart_attack_predicted")
                    if isinstance(predicted, bool):
                        model_triggered = predicted

    return model_name, lava_request_id, model_output, model_triggered


async def send_apn_notification(
    apn_endpoint: str,
    patient_id: str,
    model_output: dict[str, Any],
) -> tuple[int, dict[str, Any] | str | None]:
    apn_auth_bearer_token = require_env("APN_AUTH_BEARER_TOKEN")
    apn_topic = require_env("APN_TOPIC")

    headers = {
        "authorization": f"bearer {apn_auth_bearer_token}",
        "apns-topic": apn_topic,
        "apns-push-type": "alert",
        "apns-priority": "10",
        "content-type": "application/json",
    }

    body = {
        "aps": {
            "alert": {
                "title": "Urgent Cardiac Alert",
                "body": "Possible ST-elevation heart attack risk detected. Seek emergency care.",
            },
            "sound": "default",
        },
        "patient_id": patient_id,
        "event": "possible_stemi_heart_attack",
        "model_output": model_output,
    }

    try:
        async with httpx.AsyncClient(http2=True, timeout=15.0) as client:
            response = await client.post(apn_endpoint, headers=headers, json=body)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"APN request failed: {exc}") from exc

    parsed_response: dict[str, Any] | str | None
    try:
        parsed_json = response.json()
        parsed_response = parsed_json if isinstance(parsed_json, dict) else {"data": parsed_json}
    except ValueError:
        parsed_response = response.text if response.text else None

    return response.status_code, parsed_response


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/ecg/infer", response_model=ECGInferenceResponse)
async def infer_heart_attack_from_ecg(request: ECGInferenceRequest) -> ECGInferenceResponse:
    rule_triggered = stemi_rule_triggered(request.derived_contiguous_lead_groups)

    model_name, lava_request_id, model_output, model_triggered = await call_lava_gemini(
        request,
        rule_triggered,
    )

    # Safety gate: final alert decision follows the explicit rule requirement.
    heart_attack_predicted = rule_triggered

    apn_sent = False
    apn_status_code: int | None = None
    apn_response: dict[str, Any] | str | None = None

    if heart_attack_predicted:
        apn_status_code, apn_response = await send_apn_notification(
            apn_endpoint=str(request.paired_iphone_apn_endpoint),
            patient_id=request.patient_id,
            model_output=model_output,
        )
        apn_sent = 200 <= apn_status_code < 300

    return ECGInferenceResponse(
        model_name=model_name,
        lava_request_id=lava_request_id,
        rule_triggered=rule_triggered,
        model_triggered=model_triggered,
        heart_attack_predicted=heart_attack_predicted,
        apn_sent=apn_sent,
        apn_status_code=apn_status_code,
        apn_response=apn_response,
        model_output=model_output,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
