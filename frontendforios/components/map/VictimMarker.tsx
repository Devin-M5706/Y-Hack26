import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { VictimEvent } from "../../data/victimEvent";

interface Props {
  victim: VictimEvent;
}

export default function VictimMarker({ victim }: Props) {
  const pulseOuterScale = useRef(new Animated.Value(1)).current;
  const pulseOuterOpacity = useRef(new Animated.Value(0.48)).current;
  const pulseInnerScale = useRef(new Animated.Value(1)).current;
  const pulseInnerOpacity = useRef(new Animated.Value(0.65)).current;

  useEffect(() => {
    const outer = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseOuterScale, {
            toValue: 2.4,
            duration: 1250,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOuterScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOuterOpacity, {
            toValue: 0,
            duration: 1250,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOuterOpacity, {
            toValue: 0.48,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const inner = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseInnerScale, {
            toValue: 1.85,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseInnerScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseInnerOpacity, {
            toValue: 0.03,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseInnerOpacity, {
            toValue: 0.65,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    outer.start();
    inner.start();

    return () => {
      outer.stop();
      inner.stop();
    };
  }, [pulseInnerOpacity, pulseInnerScale, pulseOuterOpacity, pulseOuterScale]);

  return (
    <Marker
      coordinate={{ latitude: victim.lat, longitude: victim.lng }}
      anchor={{ x: 0.28, y: 0.6 }}
      title="Cardiac Event"
      description={victim.address}
    >
      <View style={styles.markerContainer}>
        <View style={styles.pulseContainer}>
          <Animated.View
            style={[
              styles.pulseOuter,
              {
                transform: [{ scale: pulseOuterScale }],
                opacity: pulseOuterOpacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.pulseInner,
              {
                transform: [{ scale: pulseInnerScale }],
                opacity: pulseInnerOpacity,
              },
            ]}
          />

          <View style={styles.pinShadow} />
          <View style={styles.pinCore}>
            <Text style={styles.pinIcon}>♥</Text>
          </View>
        </View>

        <View style={styles.label}>
          <Text style={styles.labelTitle}>{victim.name}</Text>
          <Text style={styles.labelSub}>Cardiac Event - Active</Text>
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pulseContainer: {
    width: 84,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseOuter: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(247, 73, 95, 0.52)",
    backgroundColor: "rgba(252, 70, 93, 0.2)",
  },
  pulseInner: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(255, 102, 124, 0.45)",
    backgroundColor: "rgba(244, 64, 87, 0.25)",
  },
  pinShadow: {
    position: "absolute",
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(244, 64, 87, 0.35)",
    shadowColor: "#ED2F4B",
    shadowOpacity: 0.95,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  pinCore: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "rgba(255, 140, 154, 0.45)",
    backgroundColor: "#EA2E48",
    alignItems: "center",
    justifyContent: "center",
  },
  pinIcon: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 22,
  },
  label: {
    backgroundColor: "rgba(61, 24, 35, 0.85)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 103, 121, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: -2,
  },
  labelTitle: {
    color: "#FDF9FA",
    fontSize: 14,
    fontWeight: "700",
  },
  labelSub: {
    color: "#FF8F9D",
    fontSize: 11,
    marginTop: 2,
  },
});
