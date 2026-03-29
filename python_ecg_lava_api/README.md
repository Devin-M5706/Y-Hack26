# ECG Image STEMI Lava API

This directory is a clean rewrite focused on one flow:

1. Accept an ECG image.
2. Send the image to Lava API using Gemini 3.1 Pro Preview.
3. Detect whether ST-elevation consistent with myocardial infarction is present.
4. If positive, deliver an alert event to iPhone clients through foreground-first channels (WebSocket and polling).
5. React Native app schedules a local notification when that alert event is received.

This path intentionally does not use APNs.

## Important Delivery Limitation

Without APNs, iOS cannot reliably wake a terminated app for server-originated emergency alerts.

- Works well when app is active (foreground).
- Can work in some background states depending on runtime conditions.
- Not reliable when app is force-killed or fully suspended.

## Files

- `main.py` - FastAPI app with Lava inference and alert routing
- `requirements.txt` - pip dependencies
- `pyproject.toml` - project metadata
- `.env.example` - environment variables

## Environment

Copy `.env.example` to `.env` and fill values:

- `LAVA_API_KEY` (required)
- `LAVA_CHAT_COMPLETIONS_URL` (optional override, default: `https://api.lava.so/v1/chat/completions`)
- `LAVA_MODEL_NAME` (default: `gemini-3.1-pro-preview`)
- `STEMI_CONFIDENCE_THRESHOLD` (default: `0.80`)
- `ENFORCE_STEMI_CONFIDENCE_THRESHOLD` (default: `false`)
- `DEFAULT_TARGET_DEVICE_ID` (default: `iphone-device-1`)
- `DEFAULT_TARGET_DEVICE_IDS` (optional comma-separated override)

By default, if the model returns `stemi_present=true`, the API will trigger local alert dispatch immediately (confidence threshold is informational unless `ENFORCE_STEMI_CONFIDENCE_THRESHOLD=true`).

## Install and Run

```bash
python -m venv .venv
source .venv/bin/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

- `GET /health`
- `POST /api/v1/ecg/image-analyze`
- `POST /api/v1/alerts/test`
- `WS /api/v1/devices/{device_id}/ws`
- `GET /api/v1/devices/{device_id}/alerts/next`
- `GET /api/v1/devices/{device_id}/alerts/pending`

## ECG Image Analyze Request

`POST /api/v1/ecg/image-analyze`

```json
{
  "ecgId": "ecg-001",
  "patientId": "patient-42",
  "capturedAt": "2026-03-29T12:00:00Z",
  "ecgImagePath": "python_ecg_lava_api/Screenshot 2026-03-29 052633.png",
  "emergencyPayload": {
    "emergencyId": "emerg-123",
    "victimFirstName": "Alex",
    "distanceMeters": 110.5,
    "latitude": 37.332,
    "longitude": -122.031
  },
  "metadata": {
    "source": "camera-upload"
  }
}
```

You may send either:

- raw base64 image data, or
- a full data URL like `data:image/png;base64,...`
- a relative image path like `python_ecg_lava_api/Screenshot 2026-03-29 052633.png`

The request must include exactly one of `ecgImageBase64` or `ecgImagePath`.

`targetDeviceIds` is optional. If omitted, the API uses `DEFAULT_TARGET_DEVICE_IDS` or `DEFAULT_TARGET_DEVICE_ID`.

## Alert Event Shape Sent to iPhone App

When STEMI is triggered, the backend pushes payloads like this through WebSocket or polling:

```json
{
  "type": "stemi_alert",
  "severity": "critical",
  "emergencyId": "emerg-123",
  "victimFirstName": "Alex",
  "distanceMeters": 110.5,
  "latitude": 37.332,
  "longitude": -122.031,
  "ecgId": "ecg-001",
  "title": "🚨 CRITICAL CARDIAC EMERGENCY",
  "body": "⚠️ High-confidence STEMI detected. Call emergency services NOW and respond immediately. ECG: ecg-001. Confidence: 0.91.",
  "confidence": 0.91,
  "reasoning": "...",
  "leadFindings": ["Inferior lead ST elevation"],
  "detectedAt": "2026-03-29T12:00:02Z"
}
```

Severity mapping:

- `critical`: confidence >= 0.90
- `warning`: confidence < 0.90 or confidence missing

The React Native app should schedule a local notification from this payload.

## Quick Test Alert

```bash
curl -X POST http://localhost:8000/api/v1/alerts/test \
  -H "Content-Type: application/json" \
  -d '{
    "targetDeviceIds": ["iphone-device-1"],
    "title": "Test STEMI alert",
    "body": "This is a local notification transport test."
  }'
```
