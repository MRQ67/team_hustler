import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinancialData } from '../../hooks/useFinancialData';
import { format } from 'date-fns';

export default function TransactionsScreen() {
  const router = useRouter();
  const { recentTransactions, loading } = useFinancialData();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const filters = ['All', 'Food', 'Transport', 'Shopping', 'Bills'];

  // Refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // We don't need to explicitly call refetch here since useFinancialData is already set to refetch on focus in home and accounts
    }, [])
  );

  return (
    <ScreenWrapper>
       {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-2 z-20 sticky top-0 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
        <Text className="text-3xl font-bold tracking-tight text-white font-display">Transactions</Text>
        <TouchableOpacity
          className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 active:bg-white/10"
          onPress={() => router.push('/modal/transfer')}
        >
          <Text className="text-sm font-medium text-accent font-display">Transfer</Text>
          <MaterialIcons name="swap-horiz" size={18} color="#F9E7B2" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-4 pt-6 gap-6 pb-32">
        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3 pb-2 px-1 -mx-4 px-4">
          {filters.map((filter, index) => (
             <TouchableOpacity
                key={index}
                className={`h-10 px-6 rounded-xl items-center justify-center border ${selectedFilter === filter ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/5'} mr-3`}
                onPress={() => setSelectedFilter(filter)}
             >
                <Text className={`text-sm font-medium font-body ${selectedFilter === filter ? 'text-white' : 'text-white/70'}`}>{filter}</Text>
             </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bento Grid Layout */}
        <View className="flex-row flex-wrap justify-between gap-y-4">
           {/* Large Summary Card (Spans 2 columns / full width) */}
           <GlassPane className="w-full rounded-3xl p-6 relative overflow-hidden group">
              <View className="absolute top-0 right-0 p-6 opacity-20">
                <MaterialIcons name="analytics" size={60} color="#D34E4E" />
              </View>
              <Text className="text-white/60 text-sm font-medium mb-1 font-body">Total Spent</Text>
              <Text className="text-4xl font-bold text-white mb-4 tracking-tight font-display">${recentTransactions
                .filter(tx => tx.transaction_type === 'expense')
                .reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}</Text>
              <View className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                 <View className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(211,78,78,0.5)]" style={{ width: '75%' }} />
              </View>
              <View className="flex-row justify-between items-center text-xs">
                 <Text className="text-white/50 font-body">$2,500 Limit</Text>
                 <Text className="text-accent font-body">+12% vs last month</Text>
              </View>
           </GlassPane>

           {/* Recent Transactions */}
           <View className="w-full mt-2">
              <Text className="text-white/80 text-lg font-bold mb-3 px-1 font-display">Recent Transactions</Text>
              <View className="flex-col gap-3">
                {recentTransactions.length === 0 ? (
                  <GlassPane className="p-6 items-center justify-center rounded-2xl">
                    <Text className="text-white/50 text-center mb-2">No transactions found</Text>
                    <Text className="text-white/40 text-xs text-center">Add transactions to see them here</Text>
                  </GlassPane>
                ) : (
                  recentTransactions.map((tx) => (
                    <GlassPane key={tx.id} className="rounded-2xl p-4 flex-row items-center justify-between active:bg-white/5">
                      <View className="flex-row items-center gap-4">
                        <View className="w-12 h-12 rounded-xl bg-orange-500/20 items-center justify-center border border-orange-400/10">
                          <MaterialIcons
                            name={tx.categories?.icon || (tx.transaction_type === 'income' ? 'attach-money' : 'payment')}
                            size={24}
                            color={tx.transaction_type === 'income' ? '#4ade80' : '#fb923c'}
                          />
                        </View>
                        <View>
                          <Text className="font-bold text-base text-white font-display">
                            {tx.description || 'Untitled Transaction'}
                          </Text>
                          <Text className="text-xs text-white/50 font-body">
                            {tx.categories?.name || tx.transaction_type} • {format(new Date(tx.date), 'h:mm a')}
                          </Text>
                        </View>
                      </View>
                      <Text className={`font-bold text-base font-display ${tx.transaction_type === 'income' ? 'text-accent' : 'text-primary'}`}>
                        {tx.transaction_type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                      </Text>
                    </GlassPane>
                  ))
                )}
              </View>
           </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}