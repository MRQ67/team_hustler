import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinancialData } from '../../hooks/useFinancialData';

export default function AccountsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { totalBalance, accounts, loading, refetch } = useFinancialData();

  // Refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <ScreenWrapper
        refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#fff" />
        }
    >
       {/* Header Section */}
      <View className="flex-row items-center justify-between p-6 pt-8">
        <View className="flex-1">
          <Text className="text-white text-xl font-bold font-display">Accounts</Text>
        </View>
        <TouchableOpacity className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center">
          <MaterialIcons name="notifications-none" size={24} color="white" />
          <View className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border border-[#1f1313]" />
        </TouchableOpacity>
      </View>

      {/* Net Worth Section */}
      <View className="px-6 mb-8">
        <View className="flex-col">
          <Text className="text-accent/80 text-sm font-medium tracking-wide uppercase mb-1 font-body">Total Net Worth</Text>
          <View className="flex-row items-baseline gap-2">
            <Text className="text-white text-5xl font-bold tracking-tight font-display">
              ${Math.floor(totalBalance).toLocaleString()}
              <Text className="text-white/40 text-3xl font-display">.{(totalBalance % 1).toFixed(2).substring(2)}</Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-2 mt-2">
            <View className="flex-row items-center justify-center px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30">
              <MaterialIcons name="trending-up" size={14} color="#4ade80" />
              <Text className="text-green-400 text-xs font-bold ml-1 font-body">+2.4%</Text>
            </View>
            <Text className="text-white/40 text-xs font-medium font-body">vs last month</Text>
          </View>
        </View>
      </View>

      {/* Bento Grid Layout */}
      <View className="px-6 flex-col gap-4 pb-32">
        
        {/* Render Accounts */}
        {accounts.length === 0 ? (
            <GlassPane className="w-full p-6 items-center justify-center rounded-2xl">
                <Text className="text-white/50 text-sm mb-4">No accounts found</Text>
                <TouchableOpacity className="bg-primary px-4 py-2 rounded-xl" onPress={() => router.push('/modal/account')}>
                    <Text className="text-white font-bold">Add Account</Text>
                </TouchableOpacity>
            </GlassPane>
        ) : (
            accounts.map((account) => (
                <GlassPane key={account.id} className="w-full rounded-2xl p-5 shadow-glass active:bg-white/[0.08]">
                    <View className="flex-row justify-between items-start mb-6">
                        <View className="flex-row items-center gap-3">
                        <LinearGradient
                            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
                            className="w-10 h-10 rounded-xl items-center justify-center border border-white/10"
                        >
                            <MaterialIcons 
                                name={account.account_type === 'card' ? 'credit-card' : 'account-balance-wallet'} 
                                size={20} 
                                color="white" 
                            />
                        </LinearGradient>
                        <View>
                            <Text className="text-white/60 text-xs font-medium uppercase font-body">{account.account_type}</Text>
                            <Text className="text-white text-base font-bold font-display">{account.name}</Text>
                        </View>
                        </View>
                        <MaterialIcons name="arrow-forward" size={20} color="rgba(255,255,255,0.4)" />
                    </View>
                    <View className="flex-row items-end justify-between">
                        <View>
                        <Text className="text-3xl font-bold text-white tracking-tight font-display">
                            ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Text>
                        <Text className="text-white/40 text-xs mt-1 font-body">{account.currency}</Text>
                        </View>
                        {/* Abstract Sparkline */}
                        <View className="h-10 w-24 flex-row items-end gap-1">
                        <View className="flex-1 bg-primary/20 h-[40%] rounded-t-sm" />
                        <View className="flex-1 bg-primary/40 h-[60%] rounded-t-sm" />
                        <View className="flex-1 bg-primary/30 h-[30%] rounded-t-sm" />
                        <View className="flex-1 bg-primary/60 h-[80%] rounded-t-sm" />
                        <View className="flex-1 bg-primary h-[50%] rounded-t-sm" />
                        <View className="flex-1 bg-accent h-[75%] rounded-t-sm shadow-[0_0_10px_rgba(249,231,178,0.5)]" />
                        </View>
                    </View>
                </GlassPane>
            ))
        )}

        {/* Row 4: Quick Actions (Horizontal Scroll) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3 -mx-6 px-6 pb-2">
          {[
            { icon: 'add', label: 'Add Account', bg: 'bg-primary', iconColor: 'white', action: () => router.push('/modal/account') },
            { icon: 'swap-horiz', label: 'Transfer', bg: 'bg-white/10', iconColor: 'white', action: () => router.push('/modal/transfer') },
            { icon: 'qr-code-scanner', label: 'Scan', bg: 'bg-white/10', iconColor: 'white', action: () => {} }
          ].map((action, i) => (
             <TouchableOpacity
                key={i}
                className="flex-row items-center gap-2 pl-3 pr-5 py-3 rounded-xl bg-white/5 border border-white/10 active:scale-95 mr-3"
                onPress={action.action}
             >
                <View className={`w-8 h-8 rounded-full ${action.bg} items-center justify-center shadow-lg ${action.bg === 'bg-primary' ? 'shadow-primary/30' : ''}`}>
                   <MaterialIcons name={action.icon as any} size={14} color={action.iconColor} />
                </View>
                <Text className="text-white text-sm font-medium font-body">{action.label}</Text>
             </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
