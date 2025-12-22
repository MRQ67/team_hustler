import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useFinancialData } from '../../hooks/useFinancialData';

export default function AnalyticsScreen() {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const { analytics, loading } = useFinancialData();

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

      <View className="flex-1 px-4 pt-6 gap-6 pb-32">
        {/* Chart Section */}
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
            <View className="gap-3">
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
    </ScreenWrapper>
  );
}