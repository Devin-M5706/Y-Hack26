import Constants from "expo-constants";

type AppExtraConfig = {
  ecgAlertApiBaseUrl?: string;
  ecgAlertWsBaseUrl?: string;
  ecgAlertDeviceId?: string;
  ecgAlertPollIntervalMs?: number | string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as AppExtraConfig;

const defaultApiBaseUrl = "http://127.0.0.1:8000";

function normalizeApiBase(value: string): string {
  return value.replace(/\/$/, "");
}

function defaultWsBaseFromApi(apiBaseUrl: string): string {
  return apiBaseUrl.replace(/^https?:/i, (scheme) =>
    scheme.toLowerCase() === "https:" ? "wss:" : "ws:"
  );
}

export const ECG_ALERT_API_BASE_URL = normalizeApiBase(
  String(extra.ecgAlertApiBaseUrl ?? defaultApiBaseUrl)
);

export const ECG_ALERT_WS_BASE_URL = normalizeApiBase(
  String(extra.ecgAlertWsBaseUrl ?? defaultWsBaseFromApi(ECG_ALERT_API_BASE_URL))
);

export const ECG_ALERT_DEVICE_ID = String(
  extra.ecgAlertDeviceId ?? "iphone-device-1"
);

const pollInterval = Number(extra.ecgAlertPollIntervalMs ?? 8000);
export const ECG_ALERT_POLL_INTERVAL_MS =
  Number.isFinite(pollInterval) && pollInterval >= 1000 ? pollInterval : 8000;
