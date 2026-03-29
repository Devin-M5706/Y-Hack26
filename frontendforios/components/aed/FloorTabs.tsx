import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AEDFloor, FLOORS } from "../../data/aedData";

interface Props {
  selected: AEDFloor;
  onSelect: (floor: AEDFloor) => void;
  counts: Record<AEDFloor, number>;
}

export default function FloorTabs({ selected, onSelect, counts }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FLOORS.map((floor) => {
        const active = floor === selected;
        return (
          <TouchableOpacity
            key={floor}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onSelect(floor)}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
              {floor}
            </Text>
            <View style={[styles.countBadge, active && styles.countBadgeActive]}>
              <Text
                style={[styles.countText, active && styles.countTextActive]}
              >
                {counts[floor]}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff08",
    borderWidth: 1,
    borderColor: "#ffffff10",
  },
  tabActive: {
    backgroundColor: "#E8192C",
    borderColor: "#E8192C",
  },
  tabText: {
    color: "#666666",
    fontSize: 13,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  countBadge: {
    backgroundColor: "#ffffff15",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
  },
  countBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  countText: {
    color: "#555555",
    fontSize: 11,
    fontWeight: "700",
  },
  countTextActive: {
    color: "#ffffff",
  },
});
