import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import NearbyScreen from "./screens/NearbyScreen";
import AEDLocatorScreen from "./screens/AEDLocatorScreen";

const Tab = createBottomTabNavigator();

const NAV_THEME = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: "#080808",
    card: "#111111",
    text: "#ffffff",
    border: "#1E1E1E",
    primary: "#E8192C",
    notification: "#E8192C",
  },
};

function TabIcon({
  label,
  focused,
  icon,
}: {
  label: string;
  focused: boolean;
  icon: string;
}) {
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>
        {icon}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={NAV_THEME}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: "#E8192C",
            tabBarInactiveTintColor: "#555555",
            tabBarLabelStyle: styles.tabLabel,
          }}
        >
          <Tab.Screen
            name="Nearby"
            component={NearbyScreen}
            options={{
              tabBarLabel: "Nearby",
              tabBarIcon: ({ focused }) => (
                <TabIcon label="Nearby" focused={focused} icon="📡" />
              ),
            }}
          />
          <Tab.Screen
            name="AED Finder"
            component={AEDLocatorScreen}
            options={{
              tabBarLabel: "AED Finder",
              tabBarIcon: ({ focused }) => (
                <TabIcon label="AED Finder" focused={focused} icon="🏥" />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#111111",
    borderTopColor: "#1E1E1E",
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 16,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  tabIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabEmoji: {
    fontSize: 22,
    opacity: 0.4,
  },
  tabEmojiActive: {
    opacity: 1,
  },
});
