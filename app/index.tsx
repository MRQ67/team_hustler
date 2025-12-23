import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    // You can return a loading spinner here if desired
    return null;
  }

  // If the user is logged in, redirect to the home screen
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  // If the user is not logged in, redirect to the auth screen
  return <Redirect href="/auth" />;

}
