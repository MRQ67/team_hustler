import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(email, password, name);

      if (result.success) {
        Alert.alert(
          'Success',
          'Account created successfully! Please check your email to confirm your account.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/auth/login'),
            },
          ]
        );
      } else {
        Alert.alert('Sign Up Failed', result.error || 'An error occurred');
      }
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-6 items-center">
          <LinearGradient
            colors={['#D34E4E', '#7f1d1d']}
            className="w-14 h-14 rounded-2xl items-center justify-center mb-2 shadow-lg shadow-primary/20"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="person-add" size={28} color="white" />
          </LinearGradient>
          <Text className="text-white font-display text-2xl font-bold tracking-tight text-center">Create Account</Text>
        </View>

        <GlassPane className="w-full rounded-3xl p-6">
          <View className="flex flex-col gap-4">
            
            {/* Name */}
            <View className="flex flex-col gap-2">
              <Text className="text-white/80 text-sm font-medium font-display ml-1">Full Name</Text>
              <View className="relative">
                <View className="absolute inset-y-0 left-0 pl-4 justify-center pointer-events-none z-10">
                  <MaterialIcons name="person-outline" size={20} color="rgba(255,255,255,0.4)" />
                </View>
                <TextInput
                  className="bg-white/5 border border-white/10 text-white w-full rounded-xl py-3.5 pl-11 pr-4 text-sm focus:border-primary focus:bg-white/10"
                  placeholder="John Doe"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
            <View className="flex flex-col gap-2">
              <Text className="text-white/80 text-sm font-medium font-display ml-1">Email Address</Text>
              <View className="relative">
                <View className="absolute inset-y-0 left-0 pl-4 justify-center pointer-events-none z-10">
                  <MaterialIcons name="mail-outline" size={20} color="rgba(255,255,255,0.4)" />
                </View>
                <TextInput
                  className="bg-white/5 border border-white/10 text-white w-full rounded-xl py-3.5 pl-11 pr-4 text-sm focus:border-primary focus:bg-white/10"
                  placeholder="name@example.com"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password */}
            <View className="flex flex-col gap-2">
              <Text className="text-white/80 text-sm font-medium font-display ml-1">Password</Text>
              <View className="relative">
                <View className="absolute inset-y-0 left-0 pl-4 justify-center pointer-events-none z-10">
                  <MaterialIcons name="lock-outline" size={20} color="rgba(255,255,255,0.4)" />
                </View>
                <TextInput
                  className="bg-white/5 border border-white/10 text-white w-full rounded-xl py-3.5 pl-11 pr-11 text-sm focus:border-primary focus:bg-white/10"
                  placeholder="Create a password"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  className="absolute inset-y-0 right-0 pr-4 justify-center"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View className="flex flex-col gap-2">
              <Text className="text-white/80 text-sm font-medium font-display ml-1">Confirm Password</Text>
              <View className="relative">
                <View className="absolute inset-y-0 left-0 pl-4 justify-center pointer-events-none z-10">
                  <MaterialIcons name="lock-outline" size={20} color="rgba(255,255,255,0.4)" />
                </View>
                <TextInput
                  className="bg-white/5 border border-white/10 text-white w-full rounded-xl py-3.5 pl-11 pr-11 text-sm focus:border-primary focus:bg-white/10"
                  placeholder="Confirm password"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  className="absolute inset-y-0 right-0 pr-4 justify-center"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={20} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              className={`w-full bg-primary py-4 rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] items-center mt-2 ${loading ? 'opacity-70' : ''}`}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-display font-bold text-base">Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View className="mt-4 flex-row justify-center">
              <Text className="text-white/60 text-sm font-body">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text className="text-primary font-bold ml-1">Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassPane>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default SignUpPage;