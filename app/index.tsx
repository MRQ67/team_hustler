import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },

  cardText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#3a5ed4",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
