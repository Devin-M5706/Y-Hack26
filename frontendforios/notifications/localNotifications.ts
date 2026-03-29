import * as Notifications from "expo-notifications";

import { IncomingAlert } from "../types/alerts";

let initialized = false;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function asDistanceLabel(value: IncomingAlert["distanceMeters"]): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${Math.round(value)}m away`;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      return `${Math.round(parsed)}m away`;
    }
  }

  return "nearby";
}

function fallbackTitleForSeverity(alert: IncomingAlert): string {
  const severity = String(alert.severity ?? "").toLowerCase();
  if (severity === "critical") {
    return "🚨 CRITICAL CARDIAC EMERGENCY";
  }

  return "⚠️ URGENT CARDIAC ALERT";
}

function soundForSeverity(alert: IncomingAlert): string | boolean {
  const severity = String(alert.severity ?? "").toLowerCase();
  if (severity === "critical") {
    return "critical-alert.wav";
  }

  return true;
}

export async function initializeLocalNotifications(): Promise<boolean> {
  if (initialized) {
    return true;
  }

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  initialized = status === "granted";
  return initialized;
}

export async function scheduleEmergencyLocalNotification(
  alert: IncomingAlert
): Promise<void> {
  const ready = await initializeLocalNotifications();
  if (!ready) {
    return;
  }

  const victim = alert.victimFirstName?.trim() || "Unknown";
  const severity = String(alert.severity ?? "").toLowerCase();
  const fallbackBody =
    severity === "critical"
      ? `⚠️ High-confidence STEMI for ${victim} (${asDistanceLabel(
          alert.distanceMeters
        )}). Call emergency services NOW and respond immediately.`
      : `🚑 Possible STEMI for ${victim} (${asDistanceLabel(
          alert.distanceMeters
        )}). Respond now and call emergency services.`;
  const sound = soundForSeverity(alert);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: alert.title?.trim() || fallbackTitleForSeverity(alert),
      body: alert.body?.trim() || fallbackBody,
      data: alert,
      sound,
    },
    trigger: null,
  });
}
