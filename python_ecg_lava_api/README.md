# ECG + Lava + APN (FastAPI)

Python-only FastAPI service that:

1. Loads Gemini 3.1 Pro Preview through a Lava chat-completions endpoint.
2. Accepts Apple HealthKit-style single-lead ECG input (with placeholders for upstream-derived lead groups).
3. Predicts heart-attack risk using the explicit rule: ST-segment elevation `> 2.0 mm` in contiguous leads.
4. Sends an APN push request to a known paired-iPhone APN endpoint when risk is predicted.

## Files

- `main.py` - FastAPI app and inference flow
- `requirements.txt` - Python dependencies
- `.env.example` - Required environment variable placeholders

## Install

```bash
python -m venv .venv
source .venv/bin/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Configure

Copy `.env.example` to `.env` and fill actual values.

Required env vars:

- `LAVA_API_KEY`
- `APN_AUTH_BEARER_TOKEN`
- `APN_TOPIC`

Optional:

- `LAVA_CHAT_COMPLETIONS_URL`
- `LAVA_MODEL_NAME` (defaults to `gemini-3.1-pro-preview`)

## Run

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoint

- `GET /health`
- `POST /v1/ecg/infer`

Example request:

```json
{
  "patient_id": "patient-123",
  "ecg": {
    "record_id": "hk-ecg-0001",
    "measured_at": "2026-03-29T12:00:00Z",
    "lead_label": "I",
    "sampling_rate_hz": 512,
    "voltage_samples_mv": [0.01, 0.03, -0.02, 0.04]
  },
  "derived_contiguous_lead_groups": [
    {
      "lead_names": ["II", "III"],
      "st_elevation_mm": 2.3
    }
  ],
  "paired_iphone_apn_endpoint": "https://api.push.apple.com/3/device/your-device-token",
  "healthkit_payload_placeholder": {
    "source": "HealthKit",
    "note": "Upstream payload shape placeholder"
  }
}
```

## Behavior

- The service always calls the Lava model for inference output.
- The final alert gate is deterministic: alert is triggered only when any contiguous lead group has `st_elevation_mm > 2.0` and at least 2 lead names.
- On alert, APN request is sent to the provided endpoint.
