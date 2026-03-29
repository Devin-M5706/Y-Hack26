import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { NearbyDevice } from "../../data/mockDevices";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function DeviceRow({ item }: { item: NearbyDevice }) {
  const isAlert = item.status === "alert";
  const isWatch = item.deviceType === "Apple Watch";

  return (
    <View style={[styles.row, isAlert && styles.rowAlert]}>
      {/* Icon */}
      <View
        style={[
          styles.iconBox,
          { backgroundColor: isAlert ? "#E8192C15" : "#ffffff08" },
        ]}
      >
        <Text style={styles.iconEmoji}>{isWatch ? "⌚" : "📱"}</Text>
      </View>

      {/* Info */}
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>{item.deviceType}</Text>
        <Text style={styles.rowSub}>
          {item.distanceMeters.toFixed(0)}m away · {timeAgo(item.lastSeen)}
        </Text>
      </View>

      {/* Status badge */}
      <View
        style={[
          styles.badge,
          { backgroundColor: isAlert ? "#E8192C20" : "#30D15818" },
        ]}
      >
        <View
          style={[
            styles.badgeDot,
            { backgroundColor: isAlert ? "#E8192C" : "#30D158" },
          ]}
        />
        <Text
          style={[
            styles.badgeText,
            { color: isAlert ? "#E8192C" : "#30D158" },
          ]}
        >
          {isAlert ? "Alert" : "Safe"}
        </Text>
      </View>
    </View>
  );
}

interface Props {
  devices: NearbyDevice[];
}

export default function DeviceList({ devices }: Props) {
  // Sort: alerts first
  const sorted = [...devices].sort((a, b) => {
    if (a.status === "alert" && b.status !== "alert") return -1;
    if (b.status === "alert" && a.status !== "alert") return 1;
    return a.distanceMeters - b.distanceMeters;
  });

  const alertCount = devices.filter((d) => d.status === "alert").length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {devices.length} opted-in devices within 100m
        </Text>
        {alertCount > 0 && (
          <View style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>
              {alertCount} alert{alertCount > 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>

      {/* List */}
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DeviceRow item={item} />}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Mock data note */}
      <Text style={styles.mockNote}>
        Simulated data — live geofencing backend coming in Phase 2
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "#666666",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  alertBadge: {
    backgroundColor: "#E8192C20",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  alertBadgeText: {
    color: "#E8192C",
    fontSize: 11,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  rowAlert: {
    backgroundColor: "#E8192C08",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 18,
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  rowSub: {
    color: "#555555",
    fontSize: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#111111",
    marginLeft: 72,
  },
  mockNote: {
    color: "#2A2A2A",
    fontSize: 11,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 20,
  },
});
