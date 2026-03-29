import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { VictimEvent } from "../../data/victimEvent";

interface Props {
  victim: VictimEvent;
}

export default function VictimMarker({ victim }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 2.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Marker
      coordinate={{ latitude: victim.lat, longitude: victim.lng }}
      anchor={{ x: 0.5, y: 0.5 }}
      title="Cardiac Event"
      description={victim.address}
    >
      <View style={styles.markerContainer}>
        {/* Pulse ring */}
        <Animated.View
          style={[
            styles.pulseRing,
            { transform: [{ scale: pulse }], opacity },
          ]}
        />
        {/* Core dot */}
        <View style={styles.dot}>
          <Text style={styles.dotIcon}>♥</Text>
        </View>
        {/* Label */}
        <View style={styles.label}>
          <Text style={styles.labelText}>John D.</Text>
          <Text style={styles.labelSub}>Cardiac Event</Text>
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E8192C40",
    borderWidth: 1,
    borderColor: "#E8192C60",
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E8192C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E8192C",
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  dotIcon: {
    color: "#fff",
    fontSize: 12,
  },
  label: {
    marginTop: 5,
    backgroundColor: "#111111",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E8192C40",
    alignItems: "center",
  },
  labelText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  labelSub: {
    color: "#E8192C",
    fontSize: 9,
    fontWeight: "600",
  },
});
