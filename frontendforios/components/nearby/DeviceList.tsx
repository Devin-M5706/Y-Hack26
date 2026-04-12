import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { NearbyDevice } from "../../data/mockDevices";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function DeviceRow({ item }: { item: NearbyDevice }) {
  const isAlert = item.status === "alert";

  return (
    <View style={styles.row}>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>{item.deviceType}</Text>
        <Text style={styles.rowSub}>
          {item.distanceMeters.toFixed(0)}m away - {timeAgo(item.lastSeen)}
        </Text>
      </View>

      <View style={[styles.badge, isAlert ? styles.badgeAlert : styles.badgeSafe]}>
        <Text style={[styles.badgeText, isAlert ? styles.badgeAlertText : styles.badgeSafeText]}>
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
  const sorted = [...devices].sort((a, b) => {
    if (a.status === "alert" && b.status !== "alert") return -1;
    if (b.status === "alert" && a.status !== "alert") return 1;
    return a.distanceMeters - b.distanceMeters;
  });
  const visibleDevices = sorted.slice(0, 4);

  const alertCount = devices.filter((d) => d.status === "alert").length;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Connected Lifesavers</Text>
      <Text style={styles.sectionSubtitle}>
        {devices.length} opted-in devices within 100m
      </Text>
      {alertCount > 0 ? (
        <Text style={styles.alertCount}>
          {alertCount} alert{alertCount > 1 ? "s" : ""}
        </Text>
      ) : null}

      <View style={styles.listContainer}>
        <FlatList
          data={visibleDevices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DeviceRow item={item} />}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No opted-in devices nearby</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flexShrink: 1,
  },
  sectionTitle: {
    color: "#F5F7FB",
    fontFamily: "Georgia",
    fontSize: 17,
    lineHeight: 23,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  sectionSubtitle: {
    color: "#D1D9E8",
    fontSize: 12,
    paddingHorizontal: 8,
  },
  alertCount: {
    color: "#EE5D72",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  listContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(98, 116, 146, 0.35)",
    backgroundColor: "rgba(9, 18, 31, 0.6)",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  rowInfo: {
    flex: 1,
    marginRight: 8,
  },
  rowTitle: {
    color: "#F4F7FB",
    fontSize: 17,
    marginBottom: 3,
  },
  rowSub: {
    color: "#C3CCDA",
    fontSize: 13,
  },
  badge: {
    minWidth: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeAlert: {
    backgroundColor: "rgba(196, 45, 63, 0.22)",
    borderColor: "rgba(245, 111, 130, 0.45)",
  },
  badgeSafe: {
    backgroundColor: "rgba(45, 150, 109, 0.2)",
    borderColor: "rgba(102, 207, 167, 0.4)",
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  badgeAlertText: {
    color: "#FF94A2",
  },
  badgeSafeText: {
    color: "#89E2B7",
  },
  separator: {
    height: 1,
    marginLeft: 14,
    marginRight: 14,
    backgroundColor: "rgba(146, 157, 177, 0.26)",
  },
  emptyText: {
    color: "#D1D9E8",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
});
