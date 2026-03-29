import {
  ECG_ALERT_API_BASE_URL,
  ECG_ALERT_DEVICE_ID,
  ECG_ALERT_POLL_INTERVAL_MS,
  ECG_ALERT_WS_BASE_URL,
} from "../config";
import { scheduleEmergencyLocalNotification } from "../notifications/localNotifications";
import { IncomingAlert } from "../types/alerts";

export type TransportState = {
  connectedVia: "websocket" | "polling" | "disconnected";
  lastEventAt?: string;
  pendingQueueCount?: number;
  lastError?: string;
};

type Listener = (state: TransportState) => void;

const listeners = new Set<Listener>();

let socket: WebSocket | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let pendingRequest = false;
let disposed = false;
let currentState: TransportState = {
  connectedVia: "disconnected",
};
const seenAlertKeys = new Set<string>();

function notifyState(next: Partial<TransportState>): void {
  currentState = {
    ...currentState,
    ...next,
  };

  for (const listener of listeners) {
    listener(currentState);
  }
}

function toWsUrl(): string {
  return `${ECG_ALERT_WS_BASE_URL}/api/v1/devices/${encodeURIComponent(
    ECG_ALERT_DEVICE_ID
  )}/ws`;
}

function toPollUrl(): string {
  return `${ECG_ALERT_API_BASE_URL}/api/v1/devices/${encodeURIComponent(
    ECG_ALERT_DEVICE_ID
  )}/alerts/next`;
}

function toPendingUrl(): string {
  return `${ECG_ALERT_API_BASE_URL}/api/v1/devices/${encodeURIComponent(
    ECG_ALERT_DEVICE_ID
  )}/alerts/pending`;
}

function alertKey(alert: IncomingAlert): string {
  const core = `${alert.type ?? "unknown"}:${alert.emergencyId ?? "no-emergency"}:${
    alert.detectedAt ?? "no-time"
  }:${alert.ecgId ?? "no-ecg"}`;
  return core;
}

async function handleAlert(alert: IncomingAlert): Promise<void> {
  const key = alertKey(alert);
  if (seenAlertKeys.has(key)) {
    return;
  }

  seenAlertKeys.add(key);
  if (seenAlertKeys.size > 200) {
    const [firstKey] = seenAlertKeys;
    if (firstKey) {
      seenAlertKeys.delete(firstKey);
    }
  }

  await scheduleEmergencyLocalNotification(alert);
  notifyState({
    lastEventAt: new Date().toISOString(),
  });
}

async function pollPendingCount(): Promise<void> {
  try {
    const response = await fetch(toPendingUrl());
    if (!response.ok) {
      return;
    }
    const parsed = (await response.json()) as { pending?: number };
    if (typeof parsed.pending === "number") {
      notifyState({ pendingQueueCount: parsed.pending });
    }
  } catch {
    // Ignore pending count failures.
  }
}

async function pollOnce(): Promise<void> {
  if (disposed || pendingRequest) {
    return;
  }

  pendingRequest = true;
  try {
    const response = await fetch(toPollUrl());
    if (response.status === 204) {
      await pollPendingCount();
      return;
    }

    if (!response.ok) {
      throw new Error(`Polling failed with status ${response.status}`);
    }

    const alert = (await response.json()) as IncomingAlert;
    await handleAlert(alert);
    await pollPendingCount();
  } catch (error) {
    notifyState({
      connectedVia: "polling",
      lastError:
        error instanceof Error ? error.message : "Polling failed with unknown error",
    });
  } finally {
    pendingRequest = false;
  }
}

function startPolling(): void {
  if (pollTimer) {
    return;
  }

  notifyState({ connectedVia: "polling" });
  void pollOnce();
  pollTimer = setInterval(() => {
    void pollOnce();
  }, ECG_ALERT_POLL_INTERVAL_MS);
}

function stopPolling(): void {
  if (!pollTimer) {
    return;
  }

  clearInterval(pollTimer);
  pollTimer = null;
}

function startWebSocket(): void {
  if (socket || disposed) {
    return;
  }

  try {
    socket = new WebSocket(toWsUrl());
  } catch (error) {
    notifyState({
      connectedVia: "polling",
      lastError:
        error instanceof Error ? error.message : "WebSocket initialization failed",
    });
    startPolling();
    return;
  }

  socket.onopen = () => {
    notifyState({ connectedVia: "websocket", lastError: undefined });
    stopPolling();
  };

  socket.onmessage = (event) => {
    try {
      const parsed = JSON.parse(String(event.data)) as IncomingAlert;
      void handleAlert(parsed);
    } catch {
      notifyState({ lastError: "Received invalid alert payload" });
    }
  };

  socket.onerror = () => {
    notifyState({
      connectedVia: "polling",
      lastError: "WebSocket error; falling back to polling",
    });
    startPolling();
  };

  socket.onclose = () => {
    socket = null;
    if (!disposed) {
      notifyState({ connectedVia: "polling" });
      startPolling();
      setTimeout(() => {
        if (!disposed && !socket) {
          startWebSocket();
        }
      }, 3000);
    }
  };
}

function stopWebSocket(): void {
  if (!socket) {
    return;
  }

  const active = socket;
  socket = null;
  active.close();
}

export function startAlertTransport(): () => void {
  disposed = false;
  startWebSocket();
  startPolling();

  return () => {
    disposed = true;
    stopWebSocket();
    stopPolling();
    notifyState({ connectedVia: "disconnected" });
  };
}

export function subscribeAlertTransport(listener: Listener): () => void {
  listeners.add(listener);
  listener(currentState);
  return () => {
    listeners.delete(listener);
  };
}
