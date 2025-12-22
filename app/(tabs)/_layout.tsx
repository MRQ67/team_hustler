import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';

export default function TabLayout() {
  const { session, loading } = useAuth();

  // If the user is not logged in, redirect to the auth screen
  if (!loading && !session) {
    return <Redirect href="/auth" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="accounts" />
      <Tabs.Screen name="transactions" />
      <Tabs.Screen name="analytics" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}