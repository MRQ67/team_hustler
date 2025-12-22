import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';

export default function AccountsScreen() {
  const { user } = useAuth();
  const netWorth = 12450.00;

  return (
    <ScreenWrapper>
       {/* Header Section */}
      <View className="flex-row items-center justify-between p-6 pt-8">
        <View className="flex-row items-center gap-3">
          <View className="relative w-10 h-10 rounded-full border border-white/20 overflow-hidden shadow-lg">
             <Image 
                 source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.user_metadata?.name || 'User') + '&background=random' }} 
                 className="w-full h-full"
             />
          </View>
          <View className="flex-col">
            <Text className="text-white/60 text-xs font-medium uppercase tracking-wider font-display">Welcome back</Text>
            <Text className="text-white text-sm font-bold font-display">{user?.user_metadata?.name || 'Alex Morgan'}</Text>
          </View>
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
              ${Math.floor(netWorth).toLocaleString()}
              <Text className="text-white/40 text-3xl font-display">.{(netWorth % 1).toFixed(2).substring(2)}</Text>
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
        {/* Row 1: Main Checking (Large Card) */}
        <GlassPane className="w-full rounded-2xl p-5 shadow-glass active:bg-white/[0.08]">
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-row items-center gap-3">
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
                className="w-10 h-10 rounded-xl items-center justify-center border border-white/10"
              >
                <MaterialIcons name="account-balance-wallet" size={20} color="white" />
              </LinearGradient>
              <View>
                <Text className="text-white/60 text-xs font-medium uppercase font-body">Checking</Text>
                <Text className="text-white text-base font-bold font-display">Main Checking</Text>
              </View>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color="rgba(255,255,255,0.4)" />
          </View>
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-3xl font-bold text-white tracking-tight font-display">$4,200.50</Text>
              <Text className="text-white/40 text-xs mt-1 font-body">**** 8842</Text>
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

        {/* Row 2: Two Columns */}
        <View className="flex-row gap-4">
          {/* Savings Card */}
          <GlassPane className="flex-1 rounded-2xl p-5 shadow-glass justify-between h-48 relative overflow-hidden">
            <View className="absolute -right-6 -top-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
            <View className="flex-row justify-between items-start">
              <View className="w-8 h-8 rounded-lg bg-accent/20 items-center justify-center">
                <MaterialIcons name="savings" size={16} color="#F9E7B2" />
              </View>
              <View className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                <Text className="text-[10px] text-accent font-bold font-display">Goal 60%</Text>
              </View>
            </View>
            <View className="mt-4">
              <Text className="text-white/60 text-xs font-medium uppercase mb-1 font-body">Emergency Fund</Text>
              <Text className="text-xl font-bold text-white tracking-tight font-display">$8,000</Text>
            </View>
            {/* Progress Bar */}
            <View className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <View className="h-full w-[60%] bg-accent rounded-full shadow-[0_0_8px_rgba(249,231,178,0.6)]" />
            </View>
          </GlassPane>

          {/* Crypto/Investments */}
          <GlassPane className="flex-1 rounded-2xl p-5 shadow-glass justify-between h-48">
            <View className="flex-row justify-between items-start">
              <View className="w-8 h-8 rounded-lg bg-purple-500/20 items-center justify-center">
                <MaterialIcons name="currency-bitcoin" size={16} color="#d8b4fe" />
              </View>
              <MaterialIcons name="more-horiz" size={16} color="rgba(255,255,255,0.2)" />
            </View>
            <View className="flex-1 items-center justify-center py-2">
              {/* Simple Donut Chart Representation */}
              <View className="relative w-16 h-16 rounded-full border-[3px] border-white/10 items-center justify-center">
                 <View className="absolute w-16 h-16 rounded-full border-[3px] border-purple-400 border-t-transparent border-l-transparent rotate-45" />
                 <MaterialIcons name="trending-up" size={20} color="#d8b4fe" />
              </View>
            </View>
            <View>
              <Text className="text-white/60 text-xs font-medium uppercase mb-1 font-body">Crypto Wallet</Text>
              <Text className="text-xl font-bold text-white tracking-tight font-display">$699.50</Text>
            </View>
          </GlassPane>
        </View>

        {/* Row 3: Credit Card & Debt */}
        <GlassPane className="w-full rounded-2xl p-5 shadow-glass flex-row items-center justify-between border-l-4 border-l-primary">
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 bg-black/40 rounded-lg border border-white/10 items-center justify-center">
               <Text className="text-[10px] font-bold text-white/80 tracking-widest uppercase font-display">Visa</Text>
            </View>
            <View>
              <Text className="text-white text-base font-bold font-display">Visa Black</Text>
              <Text className="text-primary text-sm font-medium font-body">Due in 3 days</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-white text-lg font-bold font-display">-$450.00</Text>
            <TouchableOpacity className="mt-1 flex-row items-center justify-end">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white font-display mr-1">Pay Now</Text>
              <MaterialIcons name="chevron-right" size={12} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>
        </GlassPane>

        {/* Row 4: Quick Actions (Horizontal Scroll) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3 -mx-6 px-6 pb-2">
          {[
            { icon: 'add', label: 'Add Account', bg: 'bg-primary', iconColor: 'white' },
            { icon: 'swap-horiz', label: 'Transfer', bg: 'bg-white/10', iconColor: 'white' },
            { icon: 'qr-code-scanner', label: 'Scan', bg: 'bg-white/10', iconColor: 'white' }
          ].map((action, i) => (
             <TouchableOpacity key={i} className="flex-row items-center gap-2 pl-3 pr-5 py-3 rounded-xl bg-white/5 border border-white/10 active:scale-95 mr-3">
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
