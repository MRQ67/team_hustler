import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../utils/supabase';
import { useFinancialData } from '../../hooks/useFinancialData';
import { useCurrencyStore } from '../../store/currencyStore';

export default function TransferModal() {
  const router = useRouter();
  const { user } = useAuth();
  const { refetch } = useFinancialData(); // Get refetch function to update data after transfer
  const { getCurrencySymbol } = useCurrencyStore();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch accounts when component mounts
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user?.id) return;

      const { data: accountsData, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching accounts:', error);
        Alert.alert('Error', 'Failed to fetch accounts: ' + error.message);
      } else {
        setAccounts(accountsData || []);
        
        // Set default accounts if available
        if (accountsData && accountsData.length >= 2) {
          setFromAccount(accountsData[0].id);
          setToAccount(accountsData[1].id);
        } else if (accountsData && accountsData.length === 1) {
          setFromAccount(accountsData[0].id);
        }
      }
    };

    fetchAccounts();
  }, [user?.id]);

  // Keypad handling
  const handlePress = (value: string) => {
    if (value === 'backspace') {
      setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (value === '.') {
      if (amount.includes('.')) return;
      setAmount(prev => prev + '.');
      return;
    }

    if (amount === '0') {
      setAmount(value);
    } else {
      setAmount(prev => prev + value);
    }
  };

  const KeypadButton = ({ value, label, icon }: { value?: string, label?: string, icon?: keyof typeof MaterialIcons.glyphMap }) => (
    <TouchableOpacity
      className="flex-1 h-16 items-center justify-center active:bg-white/5 rounded-2xl"
      onPress={() => handlePress(value || '')}
    >
      {icon ? (
        <MaterialIcons name={icon} size={24} color="white" />
      ) : (
        <Text className="text-2xl font-bold text-white font-display">{label}</Text>
      )}
    </TouchableOpacity>
  );

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!fromAccount || !toAccount) {
      Alert.alert('Error', 'Please select both from and to accounts');
      return;
    }

    if (fromAccount === toAccount) {
      Alert.alert('Error', 'From and to accounts must be different');
      return;
    }

    setLoading(true);

    try {
      // Insert the transfer record
      const { error: transferError } = await supabase
        .from('transfers')
        .insert([{
          user_id: user?.id,
          from_account_id: fromAccount,
          to_account_id: toAccount,
          amount: parseFloat(amount),
          description: description || `Transfer from account to account`,
          date: new Date().toISOString(),
        }]);

      if (transferError) {
        throw transferError;
      }

      // Go back to previous screen and refetch data
      router.back();
      refetch(); // Refetch financial data to update balances
    } catch (error: any) {
      console.error('Error creating transfer:', error);
      Alert.alert('Error', 'Failed to create transfer: ' + error.message);
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
        <Text className="text-lg font-bold text-white font-display">Transfer Funds</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 pb-8 px-4"
        contentContainerStyle={{ justifyContent: 'space-between', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Transfer Details Section */}
        <View className="gap-6">
          {/* From Account Selector */}
          <View className="gap-2">
            <Text className="text-white/60 font-medium mb-2">From Account</Text>
            <GlassPane className="rounded-2xl p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-medium">
                  {accounts.find(acc => acc.id === fromAccount)?.name || 'Select Account'}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="white" />
              </View>
            </GlassPane>

            <TouchableOpacity
              className="mt-2"
              onPress={() => {
                // Show account selection modal or dropdown
                const otherAccounts = accounts.filter(acc => acc.id !== toAccount);
                if (otherAccounts.length > 0) {
                  setFromAccount(otherAccounts[0].id);
                }
              }}
            >
              <View className="flex-row items-center gap-2">
                {accounts
                  .filter(acc => acc.id !== toAccount)
                  .map((acc, index) => (
                    <TouchableOpacity
                      key={acc.id}
                      className={`px-3 py-2 rounded-xl ${fromAccount === acc.id ? 'bg-primary' : 'bg-white/10'}`}
                      onPress={() => setFromAccount(acc.id)}
                    >
                      <Text className={`text-xs ${fromAccount === acc.id ? 'text-white' : 'text-white/70'}`}>
                        {acc.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </TouchableOpacity>
          </View>

          {/* Transfer Arrow */}
          <View className="items-center">
            <MaterialIcons name="south" size={24} color="#D34E4E" />
          </View>

          {/* To Account Selector */}
          <View className="gap-2">
            <Text className="text-white/60 font-medium mb-2">To Account</Text>
            <GlassPane className="rounded-2xl p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-medium">
                  {accounts.find(acc => acc.id === toAccount)?.name || 'Select Account'}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="white" />
              </View>
            </GlassPane>

            <TouchableOpacity
              className="mt-2"
              onPress={() => {
                // Show account selection modal or dropdown
                const otherAccounts = accounts.filter(acc => acc.id !== fromAccount);
                if (otherAccounts.length > 0) {
                  setToAccount(otherAccounts[0].id);
                }
              }}
            >
              <View className="flex-row flex-wrap gap-2">
                {accounts
                  .filter(acc => acc.id !== fromAccount)
                  .map((acc, index) => (
                    <TouchableOpacity
                      key={acc.id}
                      className={`px-3 py-2 rounded-xl ${toAccount === acc.id ? 'bg-primary' : 'bg-white/10'}`}
                      onPress={() => setToAccount(acc.id)}
                    >
                      <Text className={`text-xs ${toAccount === acc.id ? 'text-white' : 'text-white/70'}`}>
                        {acc.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View className="gap-2">
            <Text className="text-white/60 font-medium mb-2">Amount</Text>
            <GlassPane className="rounded-2xl p-4 flex-row items-center">
              <Text className="text-white/60 text-xl mr-2">{getCurrencySymbol()}</Text>
              <Text className="text-white text-3xl font-display flex-1">
                {amount || '0.00'}
              </Text>
            </GlassPane>
          </View>

          {/* Description */}
          <View className="gap-2">
            <Text className="text-white/60 font-medium mb-2">Description (Optional)</Text>
            <GlassPane className="rounded-2xl p-4">
              <TextInput
                className="text-white font-display w-full"
                placeholder="Transfer description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </GlassPane>
          </View>
        </View>

        {/* Keypad Section */}
        <View className="gap-4 pt-4">
          {/* Keypad */}
          <GlassPane className="rounded-[32px] p-4">
            <View className="flex-row gap-2 mb-2">
              <KeypadButton value="1" label="1" />
              <KeypadButton value="2" label="2" />
              <KeypadButton value="3" label="3" />
            </View>
            <View className="flex-row gap-2 mb-2">
              <KeypadButton value="4" label="4" />
              <KeypadButton value="5" label="5" />
              <KeypadButton value="6" label="6" />
            </View>
            <View className="flex-row gap-2 mb-2">
              <KeypadButton value="7" label="7" />
              <KeypadButton value="8" label="8" />
              <KeypadButton value="9" label="9" />
            </View>
            <View className="flex-row gap-2 mb-4">
              <KeypadButton value="." label="." />
              <KeypadButton value="0" label="0" />
              <KeypadButton value="backspace" icon="backspace" />
            </View>

            {/* Transfer Button */}
            <TouchableOpacity
              className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-primary/30 active:scale-[0.98]"
              onPress={handleTransfer}
              disabled={loading}
            >
              <Text className="text-white font-bold text-lg font-display">
                {loading ? 'Transferring...' : 'Transfer Funds'}
              </Text>
            </TouchableOpacity>
          </GlassPane>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}