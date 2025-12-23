import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useFinancialData } from '../../hooks/useFinancialData';

export default function AnalyticsScreen() {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const { analytics, budgets, savingsGoals, loading, refetch } = useFinancialData();

  // Refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  return (
    <ScreenWrapper>
       {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-2 z-20 sticky top-0 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
        <Text className="text-3xl font-bold tracking-tight text-white font-display">Analytics</Text>
        <TouchableOpacity className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 active:bg-white/10">
          <Text className="text-sm font-medium text-accent font-display">Oct 2023</Text>
          <MaterialIcons name="expand-more" size={18} color="#F9E7B2" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-6 gap-6 pb-32">
        {/* Chart Section */}
        <View className="mb-6">
          {analytics && analytics.length > 0 ? (
            <>
              <GlassPane className="rounded-3xl p-2 items-center justify-center">
                  <Text className="text-white/60 text-sm font-medium mb-2 w-full px-4 pt-4 font-body">Spending Breakdown</Text>
                  <PieChart
                    data={analytics}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[10, 0]}
                    absolute
                  />
              </GlassPane>

              {/* Breakdown List */}
              <View className="gap-3 mt-4">
                  <Text className="px-2 text-sm font-semibold text-white/40 uppercase tracking-wider font-display">Details</Text>
                  {analytics.map((item, index) => (
                      <GlassPane key={item.name + index} className="rounded-2xl p-4 flex-row items-center justify-between active:bg-white/5">
                          <View className="flex-row items-center gap-3">
                              <View className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                              <Text className="text-white font-medium text-base font-display">{item.name}</Text>
                          </View>
                          <View className="flex-row items-center gap-2">
                               <Text className="text-white font-bold font-display">{item.population}%</Text>
                               <Text className="text-white/40 text-sm font-body">${item.amount.toFixed(2)}</Text>
                          </View>
                      </GlassPane>
                  ))}
              </View>
            </>
          ) : (
            // Empty State
            <GlassPane className="flex-1 items-center justify-center rounded-3xl p-6">
              <View className="items-center justify-center">
                <View className="w-16 h-16 rounded-full bg-white/5 items-center justify-center mb-4">
                  <MaterialIcons name="pie-chart-outline" size={32} color="rgba(255,255,255,0.4)" />
                </View>
                <Text className="text-white/50 text-center mb-2">No spending data available</Text>
                <Text className="text-white/40 text-xs text-center">Add expenses to see your spending breakdown</Text>
              </View>
            </GlassPane>
          )}
        </View>

        {/* Budgets Section */}
        <View>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold tracking-tight text-white font-display">Budgets</Text>
            <TouchableOpacity
              className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 active:bg-white/10"
              onPress={() => router.push('/modal/budget')}
            >
              <Text className="text-xs font-medium text-accent">Add</Text>
              <MaterialIcons name="add" size={14} color="#F9E7B2" />
            </TouchableOpacity>
          </View>

          {budgets && budgets.length > 0 ? (
            budgets.map((budget) => {
              const spent = budget.spent || 0;
              const amount = budget.amount || 0;
              const percentage = amount > 0 ? Math.min(100, Math.round((spent / amount) * 100)) : 0;
              const remaining = amount - spent;

              return (
                <GlassPane key={budget.id} className="rounded-2xl p-5 mb-4">
                  <View className="flex-row justify-between items-start mb-4">
                    <View>
                      <Text className="text-white text-base font-bold font-display">
                        {budget.category_name ? `${budget.category_name} Budget` : 'Overall Budget'}
                      </Text>
                      <Text className="text-white/50 text-xs mt-1">Spent ${spent.toFixed(2)} of ${amount.toFixed(2)}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-white text-lg font-bold">{percentage}%</Text>
                      <Text className={`text-xs ${remaining >= 0 ? 'text-accent' : 'text-primary'}`}>
                        ${Math.abs(remaining).toFixed(2)} {remaining >= 0 ? 'left' : 'over'}
                      </Text>
                    </View>
                  </View>

                  <View className="h-3 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                    <View
                      className={`h-full rounded-full ${percentage > 90 ? 'bg-primary' : 'bg-accent'}`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </View>

                  <View className="flex-row justify-between mt-2">
                    <Text className="text-white/60 text-xs">Start: {new Date(budget.period_start).toLocaleDateString()}</Text>
                    <Text className="text-white/60 text-xs">End: {new Date(budget.period_end).toLocaleDateString()}</Text>
                  </View>
                </GlassPane>
              );
            })
          ) : (
            // Budget Empty State
            <GlassPane className="items-center justify-center rounded-2xl p-6">
              <View className="items-center justify-center">
                <View className="w-12 h-12 rounded-full bg-white/5 items-center justify-center mb-3">
                  <MaterialIcons name="account-balance-wallet" size={24} color="rgba(255,255,255,0.4)" />
                </View>
                <Text className="text-white/50 text-center mb-1">No budgets set</Text>
                <Text className="text-white/40 text-xs text-center">Create a budget to track your spending</Text>
                <TouchableOpacity
                  className="mt-3 bg-primary px-3 py-1.5 rounded-xl"
                  onPress={() => router.push('/modal/budget')}
                >
                  <Text className="text-white text-xs font-bold">Create Budget</Text>
                </TouchableOpacity>
              </View>
            </GlassPane>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}