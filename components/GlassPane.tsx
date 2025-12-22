import React from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassPaneProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  intensity?: number;
}

export default function GlassPane({ children, className, style, intensity = 20 }: GlassPaneProps) {
  return (
    <View 
      className={`overflow-hidden border border-white/10 ${className}`} 
      style={[{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }, style]}
    >
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      {/* Content Layer */}
      <View style={{ zIndex: 1 }}>
        {children}
      </View>
    </View>
  );
}

import { StyleSheet } from 'react-native';
