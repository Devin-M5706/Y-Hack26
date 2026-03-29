import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MOCK_DEVICES } from "../data/mockDevices";
import NearbyRadar from "../components/nearby/NearbyRadar";
import DeviceList from "../components/nearby/DeviceList";

export default function NearbyScreen() {
  const navigation = useNavigation();
  const alertCount = MOCK_DEVICES.filter((d) => d.status === "alert").length;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Nearby</Text>
            <Text style={styles.subtitle}>Opted-in devices within 100m</Text>
          </View>

          {/* AED FAB */}
          <TouchableOpacity
            style={styles.aedBtn}
            onPress={() => navigation.navigate("AED Finder" as never)}
          >
            <Text style={styles.aedBtnText}>🏥 Find AED</Text>
          </TouchableOpacity>
        </View>

        {/* Active alert banner */}
        {alertCount > 0 && (
          <View style={styles.alertBanner}>
            <Text style={styles.alertBannerTitle}>
              ⚠ {alertCount} cardiac alert{alertCount > 1 ? "s" : ""} detected
            </Text>
            <Text style={styles.alertBannerSub}>
              Tap a device on the radar for details
            </Text>
          </View>
        )}

        {/* Radar */}
        <NearbyRadar devices={MOCK_DEVICES} />

        {/* Device list */}
        <DeviceList devices={MOCK_DEVICES} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#080808",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
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
  aedBtn: {
    backgroundColor: "#30D15818",
    borderWidth: 1,
    borderColor: "#30D15840",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  aedBtnText: {
    color: "#30D158",
    fontSize: 13,
    fontWeight: "600",
  },
  alertBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#E8192C12",
    borderWidth: 1,
    borderColor: "#E8192C30",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  alertBannerTitle: {
    color: "#E8192C",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  alertBannerSub: {
    color: "#E8192C80",
    fontSize: 12,
  },
});
