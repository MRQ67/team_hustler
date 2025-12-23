import React from 'react';
import { Redirect, Stack } from 'expo-router';

import { useAuth } from '../../hooks/useAuth';

export default function AuthLayout() {
  const { session } = useAuth();

  // If the user is logged in, redirect to the home screen
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}