import { registerRootComponent } from "expo";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AlertResponseScreen from "./screens/AlertResponseScreen";

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AlertResponseScreen />
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
