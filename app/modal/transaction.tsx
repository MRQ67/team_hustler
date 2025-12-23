import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../utils/supabase';
import { useFinancialData } from '../../hooks/useFinancialData';
import { useCurrencyStore } from '../../store/currencyStore';

export default function TransactionModal() {
  const router = useRouter();
  const { user } = useAuth();
  const { refetch } = useFinancialData(); // Get refetch function to update data after transaction
  const { getCurrencySymbol } = useCurrencyStore();
  const [amount, setAmount] = useState('0');
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({ name: 'Food & Drink', icon: 'fastfood', color: '#fb923c' });
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch accounts and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      // Fetch user accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (accountsError) {
        console.error('Error fetching accounts:', accountsError);
      } else {
        setAccounts(accountsData || []);
        if (accountsData && accountsData.length > 0) {
          setSelectedAccount(accountsData[0].id); // Default to first account
        }
      }

      // Fetch user categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id);

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      } else {
        setCategories(categoriesData || []);
      }
    };

    fetchData();
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

  const handleAddTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!selectedAccount) {
      Alert.alert('Error', 'Please select an account');
      return;
    }

    setLoading(true);

    try {
      // Determine category ID if exists
      let categoryId = null;
      if (selectedCategory) {
        const { data: existingCategory, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('user_id', user?.id)
          .eq('name', selectedCategory.name)
          .single();

        if (!categoryError && existingCategory) {
          categoryId = existingCategory.id;
        }
      }

      // Insert the transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user?.id,
          account_id: selectedAccount,
          category_id: categoryId,
          transaction_type: type,
          amount: parseFloat(amount),
          description: description || `New ${type} transaction`,
          date: new Date().toISOString(),
        }]);

      if (transactionError) {
        throw transactionError;
      }

      // Go back to previous screen and refetch data
      router.back();
      refetch(); // Refetch financial data to update balances
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', 'Failed to add transaction: ' + error.message);
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
        <Text className="text-lg font-bold text-white font-display">Add Transaction</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 pb-8"
        contentContainerStyle={{ justifyContent: 'space-between', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Section: Type Selector & Display */}
        <View className="px-6 pt-6 gap-8">
           {/* Segmented Control */}
           <GlassPane className="flex-row p-1 rounded-2xl">
              {(['expense', 'income', 'transfer'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  className={`flex-1 py-3 rounded-xl items-center justify-center ${type === t ? 'bg-white/10' : ''}`}
                >
                  <Text className={`font-bold capitalize ${type === t ? 'text-white' : 'text-white/50'}`}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
           </GlassPane>

           {/* Amount Display */}
           <View className="items-center">
              <Text className="text-white/60 font-body mb-2">Amount</Text>
              <View className="flex-row items-center">
                 <Text className="text-4xl font-bold text-white/60 mr-1">{getCurrencySymbol()}</Text>
                 <Text className="text-6xl font-bold text-white font-display tracking-tight">
                    {amount}
                 </Text>
              </View>

              {/* Category Pill */}
              <TouchableOpacity className="mt-6 flex-row items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                 <View className="w-6 h-6 rounded-full bg-orange-500/20 items-center justify-center">
                    <MaterialIcons name={selectedCategory.icon} size={14} color={selectedCategory.color} />
                 </View>
                 <Text className="text-white font-medium">{selectedCategory.name}</Text>
                 <MaterialIcons name="keyboard-arrow-down" size={16} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
           </View>
        </View>

        {/* Bottom Section: Account & Keypad */}
        <View className="px-4 gap-4">
           {/* Account Selector */}
           <View className="flex-row items-center justify-between px-4 mb-2">
              <Text className="text-white/40 font-medium">From</Text>
              <TouchableOpacity className="flex-row items-center gap-2">
                 <Text className="text-white font-bold">
                   {accounts.find(acc => acc.id === selectedAccount)?.name || 'Select Account'}
                 </Text>
                 <MaterialIcons name="keyboard-arrow-down" size={16} color="white" />
              </TouchableOpacity>
           </View>

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

              {/* Done Button */}
              <TouchableOpacity
                 className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-primary/30 active:scale-[0.98]"
                 onPress={handleAddTransaction}
                 disabled={loading}
              >
                 <Text className="text-white font-bold text-lg font-display">
                   {loading ? 'Adding...' : 'Done'}
                 </Text>
              </TouchableOpacity>
           </GlassPane>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
