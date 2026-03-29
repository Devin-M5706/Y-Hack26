import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
} from "react-native";
import { NearbyDevice } from "../../data/mockDevices";

const MAX_RANGE = 100;
const DOT_RADIUS = 6;
const RINGS = [
  { scale: 0.25, label: "25m" },
  { scale: 0.5,  label: "50m" },
  { scale: 1.0,  label: "100m" },
];

function polarToXY(
  bearing: number,
  distanceMeters: number,
  center: number
): { x: number; y: number } {
  const pct = Math.min(distanceMeters / MAX_RANGE, 0.97);
  const r = pct * (center - 20); // 20px padding from edge
  const angleRad = ((bearing - 90) * Math.PI) / 180;
  return {
    x: center + r * Math.cos(angleRad),
    y: center + r * Math.sin(angleRad),
  };
}

function AlertPulse({ size }: { size: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#E8192C",
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}

interface DeviceDotProps {
  device: NearbyDevice;
  center: number;
  onPress: (d: NearbyDevice) => void;
}

function DeviceDot({ device, center, onPress }: DeviceDotProps) {
  const { x, y } = polarToXY(device.bearing, device.distanceMeters, center);
  const isAlert = device.status === "alert";
  const color = isAlert ? "#E8192C" : "#30D158";
  const isWatch = device.deviceType === "Apple Watch";

  return (
    <TouchableOpacity
      onPress={() => onPress(device)}
      style={[
        styles.dotWrapper,
        { left: x - DOT_RADIUS, top: y - DOT_RADIUS },
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {isAlert && <AlertPulse size={DOT_RADIUS * 2} />}
      <View
        style={[
          styles.dot,
          {
            backgroundColor: color,
            borderRadius: isWatch ? 3 : DOT_RADIUS,
            shadowColor: color,
            shadowOpacity: 0.8,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
      />
    </TouchableOpacity>
  );
}

function UserDot({ center }: { center: number }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.8, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.userDotWrapper, { left: center - 10, top: center - 10 }]}>
      <Animated.View
        style={[styles.userPulse, { transform: [{ scale: pulse }] }]}
      />
      <View style={styles.userDot} />
    </View>
  );
}

interface Props {
  devices: NearbyDevice[];
}

export default function NearbyRadar({ devices }: Props) {
  const { width } = useWindowDimensions();
  const RADAR_SIZE = Math.min(width - 40, 360);
  const CENTER = RADAR_SIZE / 2;

  const [selected, setSelected] = useState<NearbyDevice | null>(null);

  // Sweepline rotation
  const sweep = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 3200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const sweepRotate = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Live drift: nudge devices slightly every 2s to look live
  const [driftedDevices, setDriftedDevices] = useState<NearbyDevice[]>(devices);
  useEffect(() => {
    const interval = setInterval(() => {
      setDriftedDevices((prev) =>
        prev.map((d) => ({
          ...d,
          bearing: (d.bearing + (Math.random() * 4 - 2) + 360) % 360,
          distanceMeters: Math.max(
            5,
            Math.min(95, d.distanceMeters + (Math.random() * 4 - 2))
          ),
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ width: RADAR_SIZE, height: RADAR_SIZE }}>
        {/* Radar background circle */}
        <View
          style={[
            styles.radarBg,
            { width: RADAR_SIZE, height: RADAR_SIZE, borderRadius: CENTER },
          ]}
        />

        {/* Concentric rings */}
        {RINGS.map(({ scale, label }) => {
          const size = RADAR_SIZE * scale;
          const offset = (RADAR_SIZE - size) / 2;
          return (
            <React.Fragment key={label}>
              <View
                style={[
                  styles.ring,
                  {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    left: offset,
                    top: offset,
                  },
                ]}
              />
              <Text
                style={[
                  styles.ringLabel,
                  { left: CENTER + 4, top: CENTER - size / 2 - 10 },
                ]}
              >
                {label}
              </Text>
            </React.Fragment>
          );
        })}

        {/* Cross lines */}
        <View style={[styles.crossH, { top: CENTER - 0.5, width: RADAR_SIZE }]} />
        <View style={[styles.crossV, { left: CENTER - 0.5, height: RADAR_SIZE }]} />

        {/* Sweep line — full-size overlay rotates around center */}
        <Animated.View
          style={[
            styles.sweepOverlay,
            { width: RADAR_SIZE, height: RADAR_SIZE },
            { transform: [{ rotate: sweepRotate }] },
          ]}
          pointerEvents="none"
        >
          {/* Line from center to right edge */}
          <View
            style={[
              styles.sweepLine,
              { left: CENTER, top: CENTER - 1, width: CENTER - 10 },
            ]}
          />
          {/* Fading cone behind the sweep */}
          <View
            style={[
              styles.sweepCone,
              { left: CENTER - 4, top: CENTER - 30, width: CENTER, height: 60 },
            ]}
          />
        </Animated.View>

        {/* Device dots */}
        {driftedDevices.map((device) => (
          <DeviceDot
            key={device.id}
            device={device}
            center={CENTER}
            onPress={setSelected}
          />
        ))}

        {/* User (center) */}
        <UserDot center={CENTER} />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#30D158" }]} />
          <Text style={styles.legendText}>Safe · iPhone</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#30D158", borderRadius: 2 }]} />
          <Text style={styles.legendText}>Safe · Watch</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#E8192C" }]} />
          <Text style={styles.legendText}>Alert</Text>
        </View>
      </View>

      {/* Device detail modal */}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSelected(null)}
        >
          {selected && (
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <View style={styles.modalRow}>
                <View
                  style={[
                    styles.modalIcon,
                    {
                      backgroundColor:
                        selected.status === "alert" ? "#E8192C22" : "#30D15822",
                    },
                  ]}
                >
                  <Text style={{ fontSize: 22 }}>
                    {selected.deviceType === "iPhone" ? "📱" : "⌚"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>{selected.deviceType}</Text>
                  <Text style={styles.modalSub}>
                    {selected.distanceMeters.toFixed(0)}m away ·{" "}
                    {selected.bearing.toFixed(0)}° bearing
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        selected.status === "alert" ? "#E8192C22" : "#30D15822",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          selected.status === "alert" ? "#E8192C" : "#30D158",
                      },
                    ]}
                  >
                    {selected.status === "alert" ? "⚠ ALERT" : "● SAFE"}
                  </Text>
                </View>
              </View>
              {selected.status === "alert" && (
                <View style={styles.alertBanner}>
                  <Text style={styles.alertBannerText}>
                    Cardiac event detected on this device. Respond immediately.
                  </Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  radarBg: {
    position: "absolute",
    backgroundColor: "#0C0C0C",
    borderWidth: 1,
    borderColor: "#1E1E1E",
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#1A1A1A",
    backgroundColor: "transparent",
  },
  ringLabel: {
    position: "absolute",
    fontSize: 9,
    color: "#2E2E2E",
    fontVariant: ["tabular-nums"],
  },
  crossH: {
    position: "absolute",
    height: 1,
    backgroundColor: "#1A1A1A",
    left: 0,
  },
  crossV: {
    position: "absolute",
    width: 1,
    backgroundColor: "#1A1A1A",
    top: 0,
  },
  sweepOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  sweepLine: {
    position: "absolute",
    height: 2,
    backgroundColor: "#E8192C",
    opacity: 0.75,
  },
  sweepCone: {
    position: "absolute",
    backgroundColor: "rgba(232,25,44,0.06)",
    borderRadius: 4,
  },
  dotWrapper: {
    position: "absolute",
    width: DOT_RADIUS * 2,
    height: DOT_RADIUS * 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  dot: {
    width: DOT_RADIUS * 2,
    height: DOT_RADIUS * 2,
    elevation: 4,
  },
  userDotWrapper: {
    position: "absolute",
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  userPulse: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(59,130,246,0.25)",
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3B82F6",
    borderWidth: 2,
    borderColor: "#ffffff",
    zIndex: 1,
    shadowColor: "#3B82F6",
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  legend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: "#555555",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#111111",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: "#1E1E1E",
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
  },
  modalSub: {
    color: "#666666",
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  alertBanner: {
    marginTop: 16,
    backgroundColor: "#E8192C15",
    borderWidth: 1,
    borderColor: "#E8192C30",
    borderRadius: 12,
    padding: 12,
  },
  alertBannerText: {
    color: "#E8192C",
    fontSize: 13,
    lineHeight: 18,
  },
});
