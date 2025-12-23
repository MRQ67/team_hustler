import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../utils/supabase';
import { useFinancialData } from '../../hooks/useFinancialData';
import { useCurrencyStore } from '../../store/currencyStore';

export default function BudgetModal() {
  const router = useRouter();
  const { user } = useAuth();
  const { refetch } = useFinancialData(); // Get refetch function to update data after budget creation
  const { getCurrencySymbol } = useCurrencyStore();
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.id) return;

      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .eq('category_type', 'expense'); // Only expense categories for budgets

      if (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'Failed to fetch categories: ' + error.message);
      } else {
        setCategories(categoriesData || []);
      }
    };

    fetchCategories();
  }, [user?.id]);

  const handleCreateBudget = async () => {
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('budgets')
        .insert([{
          user_id: user?.id,
          category_id: selectedCategory || null, // Can be null for overall budget
          amount: parseFloat(budgetAmount),
          period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(), // Start of current month
          period_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(), // End of current month
        }]);

      if (error) {
        throw error;
      }

      // Go back to previous screen and refetch data
      router.back();
      refetch(); // Refetch financial data to update budgets
    } catch (error: any) {
      console.error('Error creating budget:', error);
      Alert.alert('Error', 'Failed to create budget: ' + error.message);
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
        <Text className="text-lg font-bold text-white font-display">Add Budget</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6 pb-8"
        contentContainerStyle={{ justifyContent: 'space-between', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Budget Name Input - Optional for overall budget */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Budget Name (Optional)</Text>
          <GlassPane className="rounded-2xl p-4">
            <TextInput
              className="text-white text-lg font-display"
              placeholder="e.g. Monthly Groceries"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={budgetName}
              onChangeText={setBudgetName}
              autoFocus
            />
          </GlassPane>
        </View>

        {/* Budget Amount */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Budget Amount</Text>
          <GlassPane className="rounded-2xl p-4 flex-row items-center">
            <Text className="text-white/60 text-xl mr-2">{getCurrencySymbol()}</Text>
            <TextInput
              className="text-white text-xl font-display flex-1"
              placeholder="0.00"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={budgetAmount}
              onChangeText={setBudgetAmount}
              keyboardType="numeric"
            />
          </GlassPane>
        </View>

        {/* Category Selector - Optional */}
        <View className="gap-2">
          <Text className="text-white/60 font-medium mb-2">Category (Optional)</Text>
          <Text className="text-white/40 text-xs mb-2">Leave blank for overall budget</Text>
          <View className="flex-row flex-wrap gap-2">
            <TouchableOpacity
              className={`px-4 py-3 rounded-xl ${!selectedCategory ? 'bg-primary' : 'bg-white/5'}`}
              onPress={() => setSelectedCategory(null)}
            >
              <Text className={`font-medium ${!selectedCategory ? 'text-white' : 'text-white/70'}`}>
                Overall Budget
              </Text>
            </TouchableOpacity>

            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`px-4 py-3 rounded-xl ${selectedCategory === category.id ? 'bg-primary' : 'bg-white/5'}`}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text className={`font-medium ${selectedCategory === category.id ? 'text-white' : 'text-white/70'}`}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Create Button */}
        <View className="pt-4">
          <TouchableOpacity
            className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-primary/30 active:scale-[0.98]"
            onPress={handleCreateBudget}
            disabled={loading}
          >
            <Text className="text-white font-bold text-lg font-display">
              {loading ? 'Creating...' : 'Create Budget'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}