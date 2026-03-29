import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
  const etaMin = Math.max(1, Math.round(dist / 80));
  const transport = transportLabel(transportState);

  function navigate() {
    Linking.openURL(`maps://?daddr=${victim.lat},${victim.lng}&dirflg=w`).catch(
      () => Linking.openURL(`https://maps.google.com/?q=${victim.lat},${victim.lng}`)
    );
  }

  function callEmergencyServices() {
    Linking.openURL("tel:911");
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Active Emergency</Text>

      <View style={styles.card} accessibilityLabel={`Emergency details. ${transport}`}>
        <View
          style={[
            styles.alertChip,
            transportState.connectedVia === "disconnected" &&
              styles.alertChipDisconnected,
          ]}
        >
          <View style={styles.chipDot} />
          <Text style={styles.alertChipText}>ALERT ACTIVE</Text>
        </View>

        <Text style={styles.elapsed}>{elapsed}</Text>
        <Text style={styles.distText}>
          {dist}m away - ~{etaMin} min on foot
        </Text>
        <Text style={styles.address}>{victim.address}</Text>

        <TouchableOpacity
          style={styles.navigateButton}
          onPress={navigate}
          activeOpacity={0.86}
        >
          <LinearGradient
            colors={["#B8142E", "#D92941", "#BA152F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.navigateGradient}
          >
            <Text style={styles.navigateText}>Navigate</Text>
            <Text style={styles.navigateArrow}>{">"}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callButton}
          onPress={callEmergencyServices}
          activeOpacity={0.9}
        >
          <Text style={styles.callText}>Call Emergency Services</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#F6F8FA",
    fontFamily: "Georgia",
    fontSize: 17,
    lineHeight: 23,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: "rgba(8, 16, 29, 0.84)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(236, 63, 83, 0.65)",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    shadowColor: "#D72643",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  alertChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(231, 44, 65, 0.22)",
    borderWidth: 1,
    borderColor: "rgba(244, 87, 108, 0.65)",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    shadowColor: "#EF4059",
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  alertChipDisconnected: {
    borderColor: "rgba(190, 105, 115, 0.5)",
    backgroundColor: "rgba(127, 65, 74, 0.26)",
  },
  chipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F35769",
    marginRight: 8,
  },
  alertChipText: {
    color: "#FF7E8B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  elapsed: {
    color: "#A6AEBC",
    fontSize: 14,
    marginTop: 11,
    marginBottom: 8,
  },
  distText: {
    color: "#E6ECF7",
    fontSize: 14,
    marginBottom: 4,
  },
  address: {
    color: "#D8DFEB",
    fontSize: 13,
    marginBottom: 14,
  },
  navigateButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    shadowColor: "#D92941",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  navigateGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 128, 142, 0.65)",
  },
  navigateText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  navigateArrow: {
    color: "#FFF2F5",
    fontSize: 20,
    fontWeight: "600",
    marginTop: -1,
  },
  callButton: {
    backgroundColor: "rgba(58, 67, 82, 0.7)",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(149, 161, 180, 0.3)",
  },
  callText: {
    color: "#F0F4F9",
    fontSize: 14,
    fontWeight: "600",
  },
});
