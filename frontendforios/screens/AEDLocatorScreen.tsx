import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AED_LOCATIONS, AEDFloor, FLOORS } from "../data/aedData";
import FloorTabs from "../components/aed/FloorTabs";
import AEDCard from "../components/aed/AEDCard";

export default function AEDLocatorScreen() {
  const [selectedFloor, setSelectedFloor] = useState<AEDFloor>("Concourse");

  const filtered = useMemo(
    () => AED_LOCATIONS.filter((a) => a.floor === selectedFloor),
    [selectedFloor]
  );

  const counts = useMemo(
    () =>
      FLOORS.reduce(
        (acc, floor) => ({
          ...acc,
          [floor]: AED_LOCATIONS.filter((a) => a.floor === floor).length,
        }),
        {} as Record<AEDFloor, number>
      ),
    []
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AED Finder</Text>
          <Text style={styles.subtitle}>Kline Science Tower · Yale University</Text>
        </View>
        <View style={styles.buildingBadge}>
          <Text style={styles.buildingBadgeText}>{AED_LOCATIONS.length} units</Text>
        </View>
      </View>

      {/* Address */}
      <Text style={styles.address}>219 Prospect Street, New Haven, CT</Text>

      {/* Floor tabs */}
      <FloorTabs
        selected={selectedFloor}
        onSelect={setSelectedFloor}
        counts={counts}
      />

      {/* AED cards */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((aed) => (
          <AEDCard key={aed.id} aed={aed} />
        ))}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            🏥 Always confirm AED location with building staff. Check cabinet
            regularly to ensure device is functional and accessible.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#080808",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#444444",
    fontSize: 13,
    marginTop: 2,
  },
  buildingBadge: {
    backgroundColor: "#30D15818",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#30D15840",
  },
  buildingBadgeText: {
    color: "#30D158",
    fontSize: 12,
    fontWeight: "600",
  },
  address: {
    color: "#333333",
    fontSize: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  scroll: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  disclaimer: {
    marginTop: 8,
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1E1E1E",
  },
  disclaimerText: {
    color: "#444444",
    fontSize: 12,
    lineHeight: 18,
  },
});
