import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../providers/AuthProvider';
import { supabase } from '../../utils/supabase';

export default function AccountModal() {
  const router = useRouter();
  const { user } = useAuth();
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('cash');
  const [startingBalance, setStartingBalance] = useState('0');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [accountColor, setAccountColor] = useState('#60a5fa'); // Default blue color
  const [accountIcon, setAccountIcon] = useState('payments'); // Default icon based on account type

  const accountTypes = [
    { value: 'cash', label: 'Cash', icon: 'payments' },
    { value: 'bank', label: 'Bank', icon: 'account-balance' },
    { value: 'mobile_money', label: 'Mobile Money', icon: 'phone-android' },
    { value: 'card', label: 'Card', icon: 'credit-card' },
    { value: 'savings', label: 'Savings', icon: 'account-balance-wallet' },
  ];

  const currencies = [
    { value: 'USD', label: 'USD ($)', symbol: '$' },
    { value: 'EUR', label: 'EUR (€)', symbol: '€' },
    { value: 'GBP', label: 'GBP (£)', symbol: '£' },
    { value: 'ETB', label: 'ETB (Br)', symbol: 'Br' },
    { value: 'JPY', label: 'JPY (¥)', symbol: '¥' },
    { value: 'CNY', label: 'CNY (¥)', symbol: '¥' },
    { value: 'INR', label: 'INR (₹)', symbol: '₹' },
    { value: 'CAD', label: 'CAD (C$)', symbol: 'C$' },
    { value: 'AUD', label: 'AUD (A$)', symbol: 'A$' },
  ];

  // Function to get currency symbol based on selected currency
  const getCurrencySymbol = () => {
    const selectedCurrency = currencies.find(c => c.value === currency);
    return selectedCurrency ? selectedCurrency.symbol : '$';
  };

  const handleCreateAccount = async () => {
    if (!accountName.trim()) {
      alert('Please enter an account name');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('accounts')
        .insert([{
          user_id: user?.id,
          name: accountName.trim(),
          account_type: accountType,
          starting_balance: parseFloat(startingBalance) || 0,
          currency: currency,
          color: accountColor,
          icon: accountIcon,
        }]);

      if (error) {
        throw error;
      }

      // Go back to accounts page
      router.back();
    } catch (error: any) {
      console.error('Error creating account:', error);
      alert('Error creating account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      {/* Header / Close */}
      <View className="flex-row items-center justify-between px-6 pt-4">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full bg-white/5"
          onPress={() => router.back()}
        >
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white font-display">Add Account</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-6 pt-6 justify-between pb-8">
        {/* Account Name Input */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Account Name</Text>
          <GlassPane className="rounded-2xl p-4">
            <TextInput
              className="text-white text-lg font-display"
              placeholder="e.g. Main Wallet"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={accountName}
              onChangeText={setAccountName}
              autoFocus
            />
          </GlassPane>
        </View>

        {/* Account Type Selector */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Account Type</Text>
          <View className="flex-col gap-2">
            {accountTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                className={`flex-row items-center p-4 rounded-2xl ${accountType === type.value ? 'bg-white/10' : 'bg-white/5'}`}
                onPress={() => {
                  setAccountType(type.value);
                  setAccountIcon(type.icon); // Update icon when account type changes
                }}
              >
                <View className="w-10 h-10 rounded-xl bg-white/5 items-center justify-center mr-3">
                  <MaterialIcons name={type.icon as any} size={20} color="white" />
                </View>
                <Text className="text-white font-medium flex-1">{type.label}</Text>
                {accountType === type.value && (
                  <MaterialIcons name="check" size={24} color="#D34E4E" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Starting Balance */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Starting Balance</Text>
          <GlassPane className="rounded-2xl p-4 flex-row items-center">
            <Text className="text-white/60 text-xl mr-2">{getCurrencySymbol()}</Text>
            <TextInput
              className="text-white text-xl font-display flex-1"
              placeholder="0.00"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={startingBalance}
              onChangeText={setStartingBalance}
              keyboardType="numeric"
            />
          </GlassPane>
        </View>

        {/* Currency Selector */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Currency</Text>
          <View className="flex-row flex-wrap gap-2">
            {currencies.map((curr) => (
              <TouchableOpacity
                key={curr.value}
                className={`px-4 py-3 rounded-xl ${currency === curr.value ? 'bg-primary' : 'bg-white/5'}`}
                onPress={() => setCurrency(curr.value)}
              >
                <Text className={`font-medium ${currency === curr.value ? 'text-white' : 'text-white/70'}`}>
                  {curr.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Selector */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Account Color</Text>
          <View className="flex-row flex-wrap gap-2">
            {['#60a5fa', '#34d399', '#f87171', '#a78bfa', '#fbbf24', '#38bdf8', '#a3e635', '#f472b6'].map((color) => (
              <TouchableOpacity
                key={color}
                className={`w-10 h-10 rounded-full ${accountColor === color ? 'border-2 border-white' : 'border border-white/30'}`}
                style={{ backgroundColor: color }}
                onPress={() => setAccountColor(color)}
              />
            ))}
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-primary/30 active:scale-[0.98]"
          onPress={handleCreateAccount}
          disabled={loading}
        >
          <Text className="text-white font-bold text-lg font-display">
            {loading ? 'Creating...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}