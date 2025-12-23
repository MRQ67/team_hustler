import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import { smsService } from '../services/SmsService';
import GlassPane from './GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

interface SmsParserManagerProps {
  onSmsParsed?: (count: number) => void;
}

const SmsParserManager: React.FC<SmsParserManagerProps> = ({ onSmsParsed }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const { user } = useAuth();

  // Request SMS permissions for Android
  const requestSmsPermission = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert('SMS Parsing', 'SMS parsing is only available on Android devices.');
      return false;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message: 'Finance Tracker needs access to read your SMS messages to automatically track transactions.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('SMS permission granted');
        return true;
      } else {
        console.log('SMS permission denied');
        Alert.alert('Permission Denied', 'SMS permission is required for automatic transaction tracking. Please enable it in settings.');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Handle SMS parsing
  const handleParseSms = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to use SMS parsing.');
      return;
    }

    setIsChecking(true);

    try {
      // Request permissions
      const permissionGranted = await requestSmsPermission();
      if (!permissionGranted) {
        setIsChecking(false);
        return;
      }

      // Process SMS messages
      const success = await smsService.processAndSaveSmsTransactions();
      
      if (success) {
        setLastChecked(new Date());
        Alert.alert('Success', 'SMS transactions processed successfully!');
        onSmsParsed?.(1); // Notify parent component that transactions were parsed
      } else {
        Alert.alert('Error', 'Failed to process SMS transactions. Please try again.');
      }
    } catch (error) {
      console.error('Error parsing SMS:', error);
      Alert.alert('Error', 'An error occurred while processing SMS messages.');
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-check for SMS transactions on component mount
  useEffect(() => {
    if (user && Platform.OS === 'android') {
      // Auto-check for SMS transactions periodically
      const interval = setInterval(() => {
        // Only check automatically once per hour
        if (!lastChecked || Date.now() - lastChecked.getTime() > 60 * 60 * 1000) {
          smsService.checkForNewSmsTransactions();
        }
      }, 10 * 60 * 1000); // Check every 10 minutes

      return () => clearInterval(interval);
    }
  }, [user, lastChecked]);

  if (Platform.OS !== 'android') {
    return null; // Only show on Android
  }

  return (
    <GlassPane className="rounded-2xl p-4 mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-xl bg-white/5 items-center justify-center">
            <MaterialIcons name="sms" size={20} color="#F9E7B2" />
          </View>
          <View>
            <Text className="text-white font-bold text-base font-display">SMS Transaction Parsing</Text>
            <Text className="text-white/50 text-xs">
              {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : 'Not checked yet'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-white/5 items-center justify-center"
          onPress={handleParseSms}
          disabled={isChecking}
        >
          {isChecking ? (
            <MaterialIcons name="autorenew" size={20} color="white" className="animate-spin" />
          ) : (
            <MaterialIcons name="refresh" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
      
      <Text className="text-white/60 text-xs mt-2">
        Automatically track transactions from bank SMS notifications. 
        Tap the refresh icon to manually check for new transactions.
      </Text>
    </GlassPane>
  );
};

export default SmsParserManager;