import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../utils/supabase';
import { useFinancialData } from '../../hooks/useFinancialData';

export default function SavingsGoalModal() {
  const router = useRouter();
  const { user } = useAuth();
  const { refetch } = useFinancialData(); // Get refetch function to update data after savings goal creation
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('0');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
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
      }
    };

    fetchAccounts();
  }, [user?.id]);

  const handleCreateSavingsGoal = async () => {
    if (!goalName.trim()) {
      Alert.alert('Error', 'Please enter a goal name');
      return;
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    if (targetDate && isNaN(Date.parse(targetDate))) {
      Alert.alert('Error', 'Please enter a valid target date (YYYY-MM-DD)');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('savings_goals')
        .insert([{
          user_id: user?.id,
          account_id: selectedAccount || null, // Can be null if no specific account
          name: goalName.trim(),
          target_amount: parseFloat(targetAmount),
          current_amount: parseFloat(currentAmount) || 0,
          target_date: targetDate ? new Date(targetDate).toISOString() : null,
          description: description || null,
        }]);

      if (error) {
        throw error;
      }

      // Go back to previous screen and refetch data
      router.back();
      refetch(); // Refetch financial data to update savings goals
    } catch (error: any) {
      console.error('Error creating savings goal:', error);
      Alert.alert('Error', 'Failed to create savings goal: ' + error.message);
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
        <Text className="text-lg font-bold text-white font-display">Add Savings Goal</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6 pb-8"
        contentContainerStyle={{ justifyContent: 'space-between', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Goal Name Input */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Goal Name</Text>
          <GlassPane className="rounded-2xl p-4">
            <TextInput
              className="text-white text-lg font-display"
              placeholder="e.g. Vacation Fund"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={goalName}
              onChangeText={setGoalName}
              autoFocus
            />
          </GlassPane>
        </View>

        {/* Target Amount */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Target Amount</Text>
          <GlassPane className="rounded-2xl p-4 flex-row items-center">
            <Text className="text-white/60 text-xl mr-2">$</Text>
            <TextInput
              className="text-white text-xl font-display flex-1"
              placeholder="0.00"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="numeric"
            />
          </GlassPane>
        </View>

        {/* Current Amount */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Current Amount (Optional)</Text>
          <GlassPane className="rounded-2xl p-4 flex-row items-center">
            <Text className="text-white/60 text-xl mr-2">$</Text>
            <TextInput
              className="text-white text-xl font-display flex-1"
              placeholder="0.00"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={currentAmount}
              onChangeText={setCurrentAmount}
              keyboardType="numeric"
            />
          </GlassPane>
        </View>

        {/* Target Date */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Target Date (Optional)</Text>
          <Text className="text-white/40 text-xs mb-2">Format: YYYY-MM-DD</Text>
          <GlassPane className="rounded-2xl p-4">
            <TextInput
              className="text-white font-display"
              placeholder="2024-12-31"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={targetDate}
              onChangeText={setTargetDate}
              keyboardType="numeric"
            />
          </GlassPane>
        </View>

        {/* Account Selector - Optional */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Account (Optional)</Text>
          <Text className="text-white/40 text-xs mb-2">Savings will be tracked in this account</Text>
          <View className="flex-row flex-wrap gap-2">
            <TouchableOpacity
              className={`px-4 py-3 rounded-xl ${!selectedAccount ? 'bg-white/5' : 'bg-white/10'}`}
              onPress={() => setSelectedAccount(null)}
            >
              <Text className={`font-medium ${!selectedAccount ? 'text-white/70' : 'text-white'}`}>
                No Specific Account
              </Text>
            </TouchableOpacity>

            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                className={`px-4 py-3 rounded-xl ${selectedAccount === account.id ? 'bg-primary' : 'bg-white/5'}`}
                onPress={() => setSelectedAccount(account.id)}
              >
                <Text className={`font-medium ${selectedAccount === account.id ? 'text-white' : 'text-white/70'}`}>
                  {account.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Description (Optional)</Text>
          <GlassPane className="rounded-2xl p-4">
            <TextInput
              className="text-white font-display"
              placeholder="Add a description for your goal"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </GlassPane>
        </View>

        {/* Create Button */}
        <View className="pt-4">
          <TouchableOpacity
            className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-primary/30 active:scale-[0.98]"
            onPress={handleCreateSavingsGoal}
            disabled={loading}
          >
            <Text className="text-white font-bold text-lg font-display">
              {loading ? 'Creating...' : 'Create Goal'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}