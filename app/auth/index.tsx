import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const AuthIndex = () => {
  return (
    <ScreenWrapper contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
      <View className="px-6 items-center">
        {/* Logo */}
        <LinearGradient
            colors={['#D34E4E', '#7f1d1d']}
            className="w-24 h-24 rounded-3xl items-center justify-center mb-8 shadow-lg shadow-primary/30"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <MaterialIcons name="account-balance-wallet" size={48} color="white" />
        </LinearGradient>

        <Text className="text-4xl font-bold font-display text-white text-center mb-2">Finance Tracker</Text>
        <Text className="text-white/60 font-body text-center mb-12 max-w-[250px]">
          Manage your finances, track goals, and monitor spending with ease.
        </Text>

        <View className="w-full gap-4">
          <TouchableOpacity
            className="w-full bg-primary py-4 rounded-2xl shadow-lg shadow-primary/25 active:scale-[0.98] items-center"
            onPress={() => router.push('/auth/sign-up')}
          >
            <Text className="text-white font-bold font-display text-lg">Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl active:bg-white/10 items-center"
            onPress={() => router.push('/auth/login')}
          >
            <Text className="text-white font-bold font-display text-lg">Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AuthIndex;