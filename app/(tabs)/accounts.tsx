import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinancialData } from '../../hooks/useFinancialData';
import { useCurrencyStore } from '../../store/currencyStore';
import { supabase } from '../../utils/supabase';

export default function AccountsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { totalBalance, accounts, loading, refetch } = useFinancialData();
  const { getCurrencySymbol } = useCurrencyStore();

  // Refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDeleteAccount = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      // Refresh the data to reflect the deletion
      await refetch();
      alert('Account deleted successfully');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      alert('Error deleting account: ' + error.message);
    }
  };

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
        <View className="w-10" />
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
                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                className="p-2"
                                onPress={() => router.push(`/modal/account?id=${account.id}&name=${encodeURIComponent(account.name)}&type=${account.account_type}&balance=${account.balance}&currency=${account.currency}&color=${account.color || '#60a5fa'}&icon=${account.icon || 'payments'}`)}
                            >
                                <MaterialIcons name="edit" size={20} color="rgba(255,255,255,0.7)" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="p-2"
                                onPress={() => {
                                    // Show confirmation dialog before deleting
                                    Alert.alert(
                                        'Delete Account',
                                        'Are you sure you want to delete this account? This action cannot be undone.',
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            {
                                                text: 'Delete',
                                                style: 'destructive',
                                                onPress: () => handleDeleteAccount(account.id)
                                            }
                                        ]
                                    );
                                }}
                            >
                                <MaterialIcons name="delete" size={20} color="rgba(255,255,255,0.7)" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="flex-row items-end justify-between">
                        <View>
                        <Text className="text-3xl font-bold text-white tracking-tight font-display">
                            {getCurrencySymbol()}{account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
            { icon: 'swap-horiz', label: 'Transfer', bg: 'bg-white/10', iconColor: 'white', action: () => router.push('/modal/transfer') }
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
