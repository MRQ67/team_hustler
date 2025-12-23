import React from "react";
import { Redirect, Tabs, router } from "expo-router";
import { View, Platform, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";

export default function TabLayout() {
  const { session, loading } = useAuth();

  if (!loading && !session) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: "transparent",
          borderRadius: 30,
          height: 80, // Increased height to accommodate larger icons
          borderTopWidth: 0,
          paddingBottom: 5, // Added padding to prevent cutoff
        },
        tabBarBackground: () => (
          <View
            style={{
              borderRadius: 30,
              overflow: "hidden",
              flex: 1,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
              backgroundColor: "rgba(30, 30, 30, 0.8)",
            }}
          >
            <BlurView intensity={20} tint="dark" style={{ flex: 1 }} />
          </View>
        ),
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#D34E4E",
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <View
                className={`w-12 h-12 rounded-xl items-center justify-center ${focused ? "bg-white/5" : ""}`}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 24,
                }}
              >
                <MaterialIcons name="home" size={32} color={color} />
              </View>
              {focused && (
                <View className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: "Accounts",
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <View
                className={`w-12 h-12 rounded-xl items-center justify-center ${focused ? "bg-white/5" : ""}`}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 24,
                }}
              >
                <MaterialIcons
                  name="account-balance-wallet"
                  size={32}
                  color={color}
                />
              </View>
              {focused && (
                <View className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />
              )}
            </View>
          ),
        }}
      />
      {/* Middle "Add" Button Placeholder - We can make this a modal or specific action */}
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          // href: null, // Removed to fix conflict with tabBarButton
          // But to match the design's "Floating Dock" having a big center button:
          // We can use a custom button component for this tab
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              className="top-[-20px] items-center justify-center"
              activeOpacity={0.8}
            >
              <View className="w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/40 border-4 border-background-dark">
                <MaterialIcons name="add" size={32} color="white" />
              </View>
            </TouchableOpacity>
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push("/modal/transaction");
          },
        })}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <View
                className={`w-12 h-12 rounded-xl items-center justify-center ${focused ? "bg-white/5" : ""}`}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 24,
                }}
              >
                <MaterialIcons name="bar-chart" size={32} color={color} />
              </View>
              {focused && (
                <View className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <View
                className={`w-12 h-12 rounded-xl items-center justify-center ${focused ? "bg-white/5" : ""}`}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 24,
                }}
              >
                <MaterialIcons name="person" size={32} color={color} />
              </View>
              {focused && (
                <View className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />
              )}
            </View>
          ),
        }}
      />

      {/* Hide the actual "transactions" tab from the bar if we want it accessed differently,
          OR keep it. The design shows 5 icons: Home, Pie Chart (Analytics), Add, Wallet (Accounts), Person (Settings).
          So "Transactions" is likely not a primary tab in the dock, or it's "Analytics".
          Let's map:
          1. Home -> index
          2. Analytics -> analytics (Pie Chart)
          3. Add -> (Center)
          4. Accounts -> accounts (Wallet)
          5. Settings -> settings (Person)
      */}
      <Tabs.Screen name="transactions" options={{ href: null }} />
    </Tabs>
  );
}
