import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { MOCK_VICTIM, MOCK_USER_LOCATION } from "../data/victimEvent";
import { MOCK_DEVICES } from "../data/mockDevices";
import { AED_LOCATIONS } from "../data/aedData";
import VictimMarker from "../components/map/VictimMarker";
import AEDMarker from "../components/map/AEDMarker";
import AlertInfoCard from "../components/map/AlertInfoCard";
import DeviceList from "../components/nearby/DeviceList";
import { TransportState } from "../services/alertTransport";

const DELTA = 0.003; // ~300m zoom

interface Props {
  transportState: TransportState;
}

export default function AlertResponseScreen({ transportState }: Props) {
  const mapRef = useRef<MapView>(null);

  function onMapReady() {
    mapRef.current?.fitToCoordinates(
      [
        { latitude: MOCK_VICTIM.lat, longitude: MOCK_VICTIM.lng },
        { latitude: MOCK_USER_LOCATION.lat, longitude: MOCK_USER_LOCATION.lng },
      ],
      {
        edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
        animated: true,
      }
    );
  }

  return (
    <View style={styles.root}>
      {/* Zone 1 — Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType="mutedStandard"
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

      {/* Zone 2 — Alert info card */}
      <SafeAreaView edges={["bottom"]} style={styles.bottom}>
        <AlertInfoCard
          victim={MOCK_VICTIM}
          userLocation={MOCK_USER_LOCATION}
          transportState={transportState}
        />

        {/* Zone 3 — Nearby devices */}
        <DeviceList devices={MOCK_DEVICES} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#080808",
  },
  map: {
    flex: 1,
  },
  bottom: {
    backgroundColor: "#080808",
    maxHeight: "55%",
  },
});
