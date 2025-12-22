import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TransactionsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const filters = ['All', 'Food', 'Transport', 'Shopping', 'Bills'];

  return (
    <ScreenWrapper>
       {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-2 z-20 sticky top-0 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
        <Text className="text-3xl font-bold tracking-tight text-white font-display">Transactions</Text>
        <TouchableOpacity className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 active:bg-white/10">
          <Text className="text-sm font-medium text-accent font-display">Oct 2023</Text>
          <MaterialIcons name="expand-more" size={18} color="#F9E7B2" />
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
              <Text className="text-4xl font-bold text-white mb-4 tracking-tight font-display">,240.50</Text>
              <View className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                 <View className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(211,78,78,0.5)]" style={{ width: '75%' }} />
              </View>
              <View className="flex-row justify-between items-center text-xs">
                 <Text className="text-white/50 font-body">$2,500 Limit</Text>
                 <Text className="text-accent font-body">+12% vs last month</Text>
              </View>
           </GlassPane>

           {/* Today's Highlight */}
           <View className="w-full mt-2">
              <Text className="text-white/80 text-lg font-bold mb-3 px-1 font-display">Today</Text>
              <View className="flex-col gap-3">
                 {/* Item 1 */}
                 <GlassPane className="rounded-2xl p-4 flex-row items-center justify-between active:bg-white/5">
                    <View className="flex-row items-center gap-4">
                       <View className="w-12 h-12 rounded-xl bg-orange-500/20 items-center justify-center border border-orange-400/10">
                          <MaterialIcons name="coffee" size={24} color="#fb923c" />
                       </View>
                       <View>
                          <Text className="font-bold text-base text-white font-display">Starbucks</Text>
                          <Text className="text-xs text-white/50 font-body">Coffee • 9:41 AM</Text>
                       </View>
                    </View>
                    <Text className="font-bold text-primary text-base font-display">-$5.50</Text>
                 </GlassPane>
                 {/* Item 2 */}
                 <GlassPane className="rounded-2xl p-4 flex-row items-center justify-between active:bg-white/5">
                    <View className="flex-row items-center gap-4">
                       <View className="w-12 h-12 rounded-xl bg-blue-500/20 items-center justify-center border border-blue-400/10">
                          <MaterialIcons name="local-taxi" size={24} color="#60a5fa" />
                       </View>
                       <View>
                          <Text className="font-bold text-base text-white font-display">Uber</Text>
                          <Text className="text-xs text-white/50 font-body">Transport • 8:15 AM</Text>
                       </View>
                    </View>
                    <Text className="font-bold text-primary text-base font-display">-5.20</Text>
                 </GlassPane>
              </View>
           </View>

           {/* Visual Block: Yesterday's Spending Chart (Spans 1 column ~ 48%) */}
           <GlassPane className="w-[48%] rounded-3xl p-5 justify-between mt-2 aspect-square relative overflow-hidden">
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.2)']} className="absolute inset-0 z-0" />
              <View className="relative z-10">
                 <Text className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 font-display">Yesterday</Text>
                 <Text className="text-2xl font-bold text-white font-display">03.99</Text>
              </View>
              <View className="flex-row items-end justify-between h-16 gap-1 relative z-10">
                 <View className="flex-1 bg-white/10 rounded-sm h-[40%]" />
                 <View className="flex-1 bg-primary/80 rounded-sm h-[80%] shadow-[0_0_8px_rgba(211,78,78,0.4)]" />
                 <View className="flex-1 bg-white/10 rounded-sm h-[30%]" />
                 <View className="flex-1 bg-white/10 rounded-sm h-[50%]" />
              </View>
           </GlassPane>

           {/* Visual Block: Category Focus (Spans 1 column ~ 48%) */}
           <GlassPane className="w-[48%] rounded-3xl p-5 justify-between mt-2 aspect-square">
              <View className="flex-row justify-between items-start">
                 <View className="w-10 h-10 rounded-full bg-green-500/20 items-center justify-center border border-green-500/10">
                    <MaterialIcons name="shopping-bag" size={20} color="#4ade80" />
                 </View>
                 <View className="bg-green-500/10 px-2 py-1 rounded-md">
                   <Text className="text-xs text-green-400 font-bold font-body">+20%</Text>
                 </View>
              </View>
              <View>
                 <Text className="text-white/60 text-xs font-medium font-body">Top Category</Text>
                 <Text className="text-lg font-bold text-white font-display">Groceries</Text>
              </View>
           </GlassPane>
           
           {/* Yesterday's List */}
           <View className="w-full mt-2">
              <View className="flex-col gap-3">
                 <GlassPane className="rounded-2xl p-4 flex-row items-center justify-between active:bg-white/5">
                    <View className="flex-row items-center gap-4">
                       <View className="w-12 h-12 rounded-xl bg-green-500/20 items-center justify-center border border-green-400/10">
                          <MaterialIcons name="shopping-cart" size={24} color="#4ade80" />
                       </View>
                       <View>
                          <Text className="font-bold text-base text-white font-display">Whole Foods</Text>
                          <Text className="text-xs text-white/50 font-body">Groceries • 6:30 PM</Text>
                       </View>
                    </View>
                    <Text className="font-bold text-primary text-base font-display">-$89.00</Text>
                 </GlassPane>
                 
                 <GlassPane className="rounded-2xl p-4 flex-row items-center justify-between active:bg-white/5">
                    <View className="flex-row items-center gap-4">
                       <View className="w-12 h-12 rounded-xl bg-red-500/20 items-center justify-center border border-red-400/10">
                          <MaterialIcons name="movie" size={24} color="#f87171" />
                       </View>
                       <View>
                          <Text className="font-bold text-base text-white font-display">Netflix</Text>
                          <Text className="text-xs text-white/50 font-body">Subscription • Auto</Text>
                       </View>
                    </View>
                    <Text className="font-bold text-primary text-base font-display">-4.99</Text>
                 </GlassPane>
              </View>
           </View>
           
           {/* Income Highlight */}
           <View className="w-full mt-2">
              <GlassPane className="rounded-2xl p-5 flex-row items-center justify-between border-accent/20">
                 <View className="flex-row items-center gap-4">
                    <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center border border-accent/20 shadow-[0_0_15px_rgba(249,231,178,0.2)]">
                       <MaterialIcons name="attach-money" size={24} color="#F9E7B2" />
                    </View>
                    <View>
                       <Text className="font-bold text-base text-accent font-display">Freelance Payment</Text>
                       <Text className="text-xs text-white/50 font-body">Income • Oct 12</Text>
                    </View>
                 </View>
                 <Text className="font-bold text-accent text-lg font-display">+,500.00</Text>
              </GlassPane>
           </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}