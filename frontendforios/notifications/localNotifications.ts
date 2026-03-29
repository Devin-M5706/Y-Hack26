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
  const fallbackBody = `⚠️ Possible STEMI for ${victim} (${asDistanceLabel(
    alert.distanceMeters
  )}). Call emergency services now.`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: alert.title?.trim() || "🚨🫀 POSSIBLE HEART ATTACK ALERT",
      body: alert.body?.trim() || fallbackBody,
      data: alert,
      sound: true,
    },
    trigger: null,
  });
}
