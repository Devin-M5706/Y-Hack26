import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  VictimEvent,
  UserLocation,
  distanceMeters,
  elapsedLabel,
} from "../../data/victimEvent";
import { TransportState } from "../../services/alertTransport";

interface Props {
  victim: VictimEvent;
  userLocation: UserLocation;
  transportState: TransportState;
}

function transportLabel(transportState: TransportState): string {
  if (transportState.connectedVia === "websocket") {
    return "Live alerts connected";
  }

  if (transportState.connectedVia === "polling") {
    return "Live alerts polling fallback";
  }

  return "Live alerts disconnected";
}

export default function AlertInfoCard({
  victim,
  userLocation,
  transportState,
}: Props) {
  const [elapsed, setElapsed] = useState(elapsedLabel(victim.detectedAt));

  // Tick the elapsed timer every second
  useEffect(() => {
    const t = setInterval(
      () => setElapsed(elapsedLabel(victim.detectedAt)),
      1000
    );
    return () => clearInterval(t);
  }, [victim.detectedAt]);

  const dist = Math.round(
    distanceMeters(userLocation, { lat: victim.lat, lng: victim.lng })
  );
  const etaMin = Math.max(1, Math.round(dist / 80)); // ~80 m/min walking

  function navigate() {
    Linking.openURL(
      `maps://?daddr=${victim.lat},${victim.lng}&dirflg=w`
    ).catch(() =>
      Linking.openURL(
        `https://maps.google.com/?q=${victim.lat},${victim.lng}`
      )
    );
  }

  function call911() {
    Linking.openURL("tel:911");
  }

  return (
    <View style={styles.card}>
      <View style={styles.transportRow}>
        <View
          style={[
            styles.transportDot,
            transportState.connectedVia === "websocket"
              ? styles.transportDotConnected
              : transportState.connectedVia === "polling"
              ? styles.transportDotPolling
              : styles.transportDotDisconnected,
          ]}
        />
        <Text style={styles.transportText}>{transportLabel(transportState)}</Text>
      </View>

      {/* Status row */}
      <View style={styles.statusRow}>
        <View style={styles.alertChip}>
          <View style={styles.chipDot} />
          <Text style={styles.alertChipText}>⚠ ALERT ACTIVE</Text>
        </View>
        <Text style={styles.elapsed}>{elapsed}</Text>
      </View>

      {/* Distance / ETA */}
      <View style={styles.distRow}>
        <Text style={styles.distValue}>{dist}m away</Text>
        <Text style={styles.distEta}> · ~{etaMin} min on foot</Text>
      </View>
      <Text style={styles.address} numberOfLines={1}>
        {victim.address}
      </Text>

      {/* CTAs */}
      <View style={styles.ctaRow}>
        <TouchableOpacity style={styles.navBtn} onPress={navigate}>
          <Text style={styles.navBtnText}>Navigate →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callBtn} onPress={call911}>
          <Text style={styles.callBtnText}>📞 Call 911</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111111",
    borderTopWidth: 1,
    borderColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  transportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  transportDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  transportDotConnected: {
    backgroundColor: "#30D158",
  },
  transportDotPolling: {
    backgroundColor: "#FF9F0A",
  },
  transportDotDisconnected: {
    backgroundColor: "#8E8E93",
  },
  transportText: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  alertChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E8192C18",
    borderWidth: 1,
    borderColor: "#E8192C40",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E8192C",
  },
  alertChipText: {
    color: "#E8192C",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  elapsed: {
    color: "#444444",
    fontSize: 12,
  },
  distRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 3,
  },
  distValue: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
  distEta: {
    color: "#666666",
    fontSize: 14,
  },
  address: {
    color: "#444444",
    fontSize: 12,
    marginBottom: 14,
  },
  ctaRow: {
    flexDirection: "row",
    gap: 10,
  },
  navBtn: {
    flex: 1,
    backgroundColor: "#E8192C",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  navBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  callBtn: {
    backgroundColor: "#ffffff10",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff15",
  },
  callBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
