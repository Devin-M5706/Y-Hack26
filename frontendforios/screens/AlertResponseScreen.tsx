import React, { useCallback, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { MOCK_VICTIM, MOCK_USER_LOCATION } from "../data/victimEvent";
import { MOCK_DEVICES } from "../data/mockDevices";
import { AED_LOCATIONS } from "../data/aedData";
import VictimMarker from "../components/map/VictimMarker";
import AEDMarker from "../components/map/AEDMarker";
import AlertInfoCard from "../components/map/AlertInfoCard";
import DeviceList from "../components/nearby/DeviceList";
import { TransportState } from "../services/alertTransport";

const DELTA = 0.003;

interface Props {
  transportState: TransportState;
}

export default function AlertResponseScreen({ transportState }: Props) {
  const mapRef = useRef<MapView>(null);
  const { width, height } = useWindowDimensions();

  const mapHeight = useMemo(() => Math.max(260, Math.min(height * 0.52, 460)), [height]);
  const panelMinHeight = useMemo(
    () => Math.max(300, height - mapHeight - 20),
    [height, mapHeight]
  );
  const panelWidth = Math.min(width - 18, 680);

  const onMapReady = useCallback(() => {
    mapRef.current?.fitToCoordinates(
      [
        { latitude: MOCK_VICTIM.lat, longitude: MOCK_VICTIM.lng },
        { latitude: MOCK_USER_LOCATION.lat, longitude: MOCK_USER_LOCATION.lng },
      ],
      {
        edgePadding: {
          top: 62,
          right: 62,
          bottom: 62,
          left: 62,
        },
        animated: true,
      }
    );
  }, []);

  return (
    <SafeAreaView edges={["top", "bottom", "left", "right"]} style={styles.root}>
      <View style={styles.layout}>
        <View style={[styles.mapShell, { height: mapHeight }]}> 
          <MapView
            ref={mapRef}
            style={styles.map}
            mapType="standard"
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass={false}
            initialRegion={{
              latitude: MOCK_VICTIM.lat,
              longitude: MOCK_VICTIM.lng,
              latitudeDelta: DELTA,
              longitudeDelta: DELTA,
            }}
            onMapReady={onMapReady}
          >
            <VictimMarker victim={MOCK_VICTIM} />
            {AED_LOCATIONS.map((aed) => (
              <AEDMarker key={aed.id} aed={aed} />
            ))}
          </MapView>
        </View>

        <View style={[styles.dashboardWrap, { minHeight: panelMinHeight }]}> 
          <LinearGradient
            pointerEvents="none"
            colors={[
              "rgba(255, 44, 68, 0)",
              "rgba(255, 44, 68, 0.34)",
              "rgba(255, 44, 68, 0)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.panelEdgeGlow}
          />

          <View style={[styles.dashboardPanel, { width: panelWidth }]}> 
            <LinearGradient
              pointerEvents="none"
              colors={[
                "rgba(49, 58, 71, 0.96)",
                "rgba(19, 27, 40, 0.96)",
                "rgba(12, 18, 29, 0.96)",
              ]}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.panelBackground}
            />

            <ScrollView
              style={styles.panelScroll}
              contentContainerStyle={styles.panelScrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <Text style={styles.heading}>
                Handsforhearts{"\n"}
                Responder{"\n"}
                Dashboard V2
              </Text>

              <AlertInfoCard
                victim={MOCK_VICTIM}
                userLocation={MOCK_USER_LOCATION}
                transportState={transportState}
              />

              <DeviceList devices={MOCK_DEVICES} />
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#05080F",
  },
  layout: {
    flex: 1,
    backgroundColor: "#05080F",
  },
  mapShell: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    marginHorizontal: 10,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(90, 112, 146, 0.35)",
  },
  map: {
    flex: 1,
  },
  dashboardWrap: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    position: "relative",
  },
  panelEdgeGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  dashboardPanel: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(235, 63, 83, 0.55)",
    overflow: "hidden",
    shadowColor: "#D8324D",
    shadowOpacity: 0.52,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  panelBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  panelScroll: {
    flex: 1,
  },
  panelScrollContent: {
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 16,
  },
  heading: {
    color: "#F7F8FA",
    fontFamily: "Georgia",
    fontSize: 34,
    lineHeight: 39,
    letterSpacing: 0.2,
    marginBottom: 20,
  },
});
