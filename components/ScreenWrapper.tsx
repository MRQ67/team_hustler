import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scroll?: boolean;
}

export default function ScreenWrapper({ children, style, contentContainerStyle, scroll = true }: ScreenWrapperProps) {
  return (
    <View className="flex-1 bg-background-dark relative">
      {/* Ambient Glows */}
      <View className="absolute top-[-100px] left-[-50px] w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" style={{ backgroundColor: '#D34E4E', transform: [{ scale: 1.5 }] }}>
        <LinearGradient
          colors={['#D34E4E', 'transparent']}
          style={{ width: '100%', height: '100%', borderRadius: 150 }}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </View>
      <View className="absolute bottom-[20%] right-[-50px] w-[250px] h-[250px] rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: '#F9E7B2' }}>
         <LinearGradient
          colors={['#F9E7B2', 'transparent']}
          style={{ width: '100%', height: '100%', borderRadius: 125 }}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        {scroll ? (
          <ScrollView 
            className="flex-1" 
            contentContainerStyle={[{ paddingBottom: 100 }, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1" style={style}>
            {children}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
