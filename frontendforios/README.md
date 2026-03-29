# frontendforios local alert wiring

This app now supports foreground-first local alert delivery from the Python ECG API.

## How it works

1. The app connects to `WS /api/v1/devices/{deviceId}/ws`.
2. If the socket drops, it falls back to polling `GET /api/v1/devices/{deviceId}/alerts/next`.
3. For each incoming alert payload, the app schedules a local notification using `expo-notifications`.

No APNs is used in this path.

## Severity sounds

- `critical` alerts use custom sound: `assets/sounds/critical-alert.wav`
- `warning` alerts use default system notification sound

If you regenerate the custom sound, run:

```bash
python scripts/generate_critical_alert_wav.py
```

## Runtime config (`app.json` -> `expo.extra`)

- `ecgAlertApiBaseUrl` (default: `http://127.0.0.1:8000`)
- `ecgAlertWsBaseUrl` (default: `ws://127.0.0.1:8000`)
- `ecgAlertDeviceId` (default: `iphone-device-1`)
- `ecgAlertPollIntervalMs` (default: `8000`)

If running on a real iPhone, replace `127.0.0.1` with your computer's LAN IP.

## Quick transport test

From project root, run backend:

```bash
uvicorn python_ecg_lava_api.main:app --reload --host 0.0.0.0 --port 8000
```

Then trigger a test alert:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/alerts/test \
  -H "Content-Type: application/json" \
  -d '{
    "targetDeviceIds": ["iphone-device-1"],
    "title": "Test STEMI alert",
    "body": "Foreground-first local notification test"
  }'
```

Open the iOS app and verify the local notification appears.
