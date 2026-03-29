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
      anchor={{ x: 0.5, y: 0.5 }}
      title={aed.label}
      description={`${aed.building} · ${aed.description}`}
    >
      <View style={styles.container}>
        <View style={styles.dot}>
          <Text style={styles.icon}>＋</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>AED</Text>
          <Text style={styles.labelSub}>{aed.label}</Text>
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#30D158",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#30D158",
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  icon: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  label: {
    marginTop: 4,
    backgroundColor: "#111111",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#30D15840",
    alignItems: "center",
  },
  labelText: {
    color: "#30D158",
    fontSize: 10,
    fontWeight: "700",
  },
  labelSub: {
    color: "#ffffff99",
    fontSize: 8,
    fontWeight: "500",
  },
});
