import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { AEDLocation } from "../../data/aedData";

interface Props {
  aed: AEDLocation;
}

export default function AEDMarker({ aed }: Props) {
  return (
    <Marker
      coordinate={{ latitude: aed.lat, longitude: aed.lng }}
      anchor={{ x: 0.5, y: 0.7 }}
      title={aed.label}
      description={`${aed.building} · ${aed.description}`}
    >
      <View style={styles.container}>
        <View style={styles.glow} />
        <View style={styles.dot}>
          <Text style={styles.icon}>✚</Text>
        </View>
        <Text style={styles.label}>AED - {aed.label}</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    minWidth: 132,
  },
  glow: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(83, 255, 166, 0.24)",
    shadowColor: "#57FFB0",
    shadowOpacity: 0.85,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(117, 255, 189, 0.7)",
    backgroundColor: "#1C8C56",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: "#D3FFE6",
    fontSize: 19,
    lineHeight: 20,
    fontWeight: "700",
  },
  label: {
    color: "#EFF4FB",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 7,
    textShadowColor: "rgba(5, 8, 14, 0.7)",
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 1 },
  },
});
