import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
} from "react-native";
import { AEDLocation } from "../../data/aedData";

const BUILDING_COORDS = "41.3176,-72.9232"; // Kline Science Tower, Yale

function GreenPulse({ size }: { size: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#30D158",
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}

interface Props {
  aed: AEDLocation;
}

export default function AEDCard({ aed }: Props) {
  function openDirections() {
    const url = `maps://?daddr=${BUILDING_COORDS}&dirflg=w`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback: Google Maps web
        Linking.openURL(
          `https://maps.google.com/?q=${BUILDING_COORDS}`
        );
      }
    });
  }

  return (
    <View style={styles.card}>
      {/* Cross icon with pulse */}
      <View style={styles.iconWrap}>
        <GreenPulse size={48} />
        <View style={styles.crossIcon}>
          <View style={styles.crossH} />
          <View style={styles.crossV} />
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.room}>{aed.room}</Text>
        <Text style={styles.label}>{aed.label}</Text>
        <Text style={styles.description}>{aed.description}</Text>
      </View>

      {/* Directions button */}
      <TouchableOpacity style={styles.dirBtn} onPress={openDirections}>
        <Text style={styles.dirBtnText}>Directions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    borderWidth: 1,
    borderColor: "#1E1E1E",
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  crossIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  crossH: {
    position: "absolute",
    width: 28,
    height: 7,
    backgroundColor: "#30D158",
    borderRadius: 3,
  },
  crossV: {
    position: "absolute",
    width: 7,
    height: 28,
    backgroundColor: "#30D158",
    borderRadius: 3,
  },
  info: {
    flex: 1,
  },
  room: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  label: {
    color: "#888888",
    fontSize: 13,
    marginBottom: 2,
  },
  description: {
    color: "#444444",
    fontSize: 11,
  },
  dirBtn: {
    backgroundColor: "#30D15818",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#30D15840",
  },
  dirBtnText: {
    color: "#30D158",
    fontSize: 12,
    fontWeight: "600",
  },
});
