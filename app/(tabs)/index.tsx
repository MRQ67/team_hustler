import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinancialData } from '../../hooks/useFinancialData';
import { format } from 'date-fns';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { totalBalance, income, expense, recentTransactions, loading, refetch } = useFinancialData();

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <ScreenWrapper 
       scroll={true}
       contentContainerStyle={{ paddingBottom: 100 }}
       refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#fff" />
       }
    >
      {/* Header */}
      <View className="flex-row items-center justify-between p-6">
        <View className="flex-row items-center gap-3">
          <View className="relative">
            <View className="w-12 h-12 rounded-full border-2 border-white/10 overflow-hidden bg-gray-500">
               {/* Avatar Placeholder */}
               <Image 
                 source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.user_metadata?.name || 'User') + '&background=random' }} 
                 className="w-full h-full"
               />
            </View>
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-background-dark" />
          </View>
          <View>
            <Text className="text-white/60 text-xs font-medium font-display uppercase tracking-wider">Good Morning</Text>
            <Text className="text-white text-lg font-bold font-display">{user?.user_metadata?.name || 'Alex Sterling'}</Text>
          </View>
        </View>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center relative">
          <MaterialIcons name="notifications-none" size={24} color="white" />
          <View className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border border-background-dark" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-4 gap-4 pb-24">
        {/* Total Balance Card */}
        <GlassPane className="p-6 rounded-3xl relative overflow-hidden">
          {/* Background Glow */}
          <View className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <View className="relative z-10 flex-col gap-1">
            <Text className="text-white/60 text-sm font-medium font-body">Total Balance</Text>
            <Text className="text-4xl font-bold tracking-tight text-white font-display">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <View className="flex-row items-center gap-2 mt-2">
              <View className="flex-row items-center bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/30">
                <MaterialIcons name="trending-up" size={14} color="#4ade80" />
                <Text className="text-green-400 text-xs font-bold ml-1">+12%</Text>
              </View>
              <Text className="text-white/40 text-xs font-medium">vs last month</Text>
            </View>
          </View>

          {/* Abstract Line/Graph Decor */}
           <View className="absolute bottom-0 left-0 w-full h-16 opacity-20 pointer-events-none flex-row items-end justify-between px-4">
              <View className="w-8 h-4 bg-white/20 rounded-t-sm" />
              <View className="w-8 h-8 bg-white/40 rounded-t-sm" />
              <View className="w-8 h-6 bg-white/30 rounded-t-sm" />
              <View className="w-8 h-10 bg-white/50 rounded-t-sm" />
              <View className="w-8 h-12 bg-white/60 rounded-t-sm" />
              <View className="w-8 h-8 bg-white/40 rounded-t-sm" />
           </View>
        </GlassPane>

        {/* Income & Expense Row */}
        <View className="flex-row gap-4">
          <GlassPane className="flex-1 p-5 rounded-2xl gap-3">
            <View className="w-10 h-10 rounded-full bg-accent/10 items-center justify-center">
              <MaterialIcons name="arrow-downward" size={20} color="#F9E7B2" />
            </View>
            <View>
              <Text className="text-white/50 text-xs font-medium mb-1">Income</Text>
              <Text className="text-accent text-xl font-bold tracking-tight">${income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </View>
          </GlassPane>
          <GlassPane className="flex-1 p-5 rounded-2xl gap-3">
             <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
              <MaterialIcons name="arrow-upward" size={20} color="#D34E4E" />
            </View>
            <View>
              <Text className="text-white/50 text-xs font-medium mb-1">Expense</Text>
              <Text className="text-white text-xl font-bold tracking-tight">${expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </View>
          </GlassPane>
        </View>

        {/* Quick Actions */}
        <GlassPane className="p-4 rounded-2xl">
          <Text className="text-white/80 text-sm font-semibold mb-4 px-1">Quick Actions</Text>
          <View className="flex-row justify-between px-2">
            {[
              { icon: 'send', label: 'Send', color: '#F9E7B2' },
              { icon: 'request-quote', label: 'Request', color: 'white' },
              { icon: 'add-card', label: 'Top-up', color: 'white' },
              { icon: 'receipt-long', label: 'Bills', color: 'white' },
            ].map((action, index) => (
              <TouchableOpacity key={index} className="items-center gap-2">
                <View className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 items-center justify-center active:bg-white/10">
                  <MaterialIcons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text className="text-[11px] text-white/70 font-medium">{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassPane>

        {/* Budget Progress */}
        <GlassPane className="p-5 rounded-2xl gap-3">
          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-white text-sm font-semibold mb-1">Monthly Budget</Text>
              <Text className="text-white/50 text-xs">You've spent <Text className="text-white font-medium">,200</Text> of $3,000</Text>
            </View>
            <Text className="text-accent text-sm font-bold">40%</Text>
          </View>
          <View className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <View className="h-full bg-accent rounded-full shadow-[0_0_8px_rgba(249,231,178,0.6)]" style={{ width: '40%' }} />
          </View>
        </GlassPane>

        {/* Recent Transactions */}
        <GlassPane className="rounded-2xl overflow-hidden mb-6">
          <View className="p-5 pb-2 flex-row justify-between items-center">
            <Text className="text-white text-sm font-semibold">Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
               <Text className="text-primary text-xs font-semibold">See all</Text>
            </TouchableOpacity>
          </View>
          <View>
            {recentTransactions.length === 0 ? (
                <View className="p-4 items-center">
                    <Text className="text-white/40 text-sm">No recent transactions</Text>
                </View>
            ) : (
                recentTransactions.map((tx, index) => (
                <TouchableOpacity key={tx.id} className={`flex-row items-center justify-between p-4 active:bg-white/5 ${index !== recentTransactions.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-white/5 items-center justify-center">
                        <MaterialIcons 
                            name={(tx.categories?.icon as any) || (tx.transaction_type === 'income' ? 'attach-money' : 'payment')} 
                            size={20} 
                            color={tx.transaction_type === 'income' ? '#F9E7B2' : 'white'} 
                        />
                    </View>
                    <View>
                        <Text className="text-white text-sm font-semibold">{tx.description || 'Untitled'}</Text>
                        <Text className="text-white/40 text-[11px]">{format(new Date(tx.date), 'MMM d, h:mm a')}</Text>
                    </View>
                    </View>
                    <Text className={`font-bold text-sm ${tx.transaction_type === 'income' ? 'text-accent' : 'text-white'}`}>
                    {tx.transaction_type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                    </Text>
                </TouchableOpacity>
                ))
            )}
          </View>
        </GlassPane>
      </View>
    </ScreenWrapper>
  );
}