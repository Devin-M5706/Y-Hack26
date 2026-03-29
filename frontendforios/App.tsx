import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AlertResponseScreen from "./screens/AlertResponseScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AlertResponseScreen />
    </SafeAreaProvider>
  );
}
