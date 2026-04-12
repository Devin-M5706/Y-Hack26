import { registerRootComponent } from "expo";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { initializeLocalNotifications } from "./notifications/localNotifications";
import {
  startAlertTransport,
  subscribeAlertTransport,
  type TransportState,
} from "./services/alertTransport";
import AlertResponseScreen from "./screens/AlertResponseScreen";

const initialTransportState: TransportState = {
  connectedVia: "disconnected",
};

function App() {
  const [transportState, setTransportState] = useState<TransportState>(
    initialTransportState
  );

  useEffect(() => {
    void initializeLocalNotifications();

    const stopTransport = startAlertTransport();
    const unsubscribe = subscribeAlertTransport(setTransportState);

    return () => {
      unsubscribe();
      stopTransport();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AlertResponseScreen transportState={transportState} />
    </SafeAreaProvider>
  );
}

registerRootComponent(App);

