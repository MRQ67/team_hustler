import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TransactionModal() {
  const router = useRouter();
  const [amount, setAmount] = useState('0');
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense');
  
  // Keypad handling
  const handlePress = (value: string) => {
    if (value === 'backspace') {
      setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (value === '.') {
      if (amount.includes('.')) return;
      setAmount(prev => prev + '.');
      return;
    }
    
    if (amount === '0') {
      setAmount(value);
    } else {
      setAmount(prev => prev + value);
    }
  };

  const KeypadButton = ({ value, label, icon }: { value?: string, label?: string, icon?: keyof typeof MaterialIcons.glyphMap }) => (
    <TouchableOpacity 
      className="flex-1 h-16 items-center justify-center active:bg-white/5 rounded-2xl"
      onPress={() => handlePress(value || '')}
    >
      {icon ? (
        <MaterialIcons name={icon} size={24} color="white" />
      ) : (
        <Text className="text-2xl font-bold text-white font-display">{label}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      {/* Header / Close */}
      <View className="flex-row items-center justify-between px-6 pt-4">
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center rounded-full bg-white/5"
          onPress={() => router.back()}
        >
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white font-display">Add Transaction</Text>
        <View className="w-10" /> 
      </View>

      <View className="flex-1 justify-between pb-8">
        {/* Top Section: Type Selector & Display */}
        <View className="px-6 pt-6 gap-8">
           {/* Segmented Control */}
           <GlassPane className="flex-row p-1 rounded-2xl">
              {(['expense', 'income', 'transfer'] as const).map((t) => (
                <TouchableOpacity 
                  key={t}
                  onPress={() => setType(t)}
                  className={`flex-1 py-3 rounded-xl items-center justify-center ${type === t ? 'bg-white/10' : ''}`}
                >
                  <Text className={`font-bold capitalize ${type === t ? 'text-white' : 'text-white/50'}`}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
           </GlassPane>

           {/* Amount Display */}
           <View className="items-center">
              <Text className="text-white/60 font-body mb-2">Amount</Text>
              <View className="flex-row items-center">
                 <Text className="text-4xl font-bold text-white/60 mr-1">$</Text>
                 <Text className="text-6xl font-bold text-white font-display tracking-tight">
                    {amount}
                 </Text>
              </View>
              
              {/* Category Pill */}
              <TouchableOpacity className="mt-6 flex-row items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                 <View className="w-6 h-6 rounded-full bg-orange-500/20 items-center justify-center">
                    <MaterialIcons name="fastfood" size={14} color="#fb923c" />
                 </View>
                 <Text className="text-white font-medium">Food & Drink</Text>
                 <MaterialIcons name="keyboard-arrow-down" size={16} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
           </View>
        </View>

        {/* Bottom Section: Account & Keypad */}
        <View className="px-4 gap-4">
           {/* Account Selector */}
           <View className="flex-row items-center justify-between px-4 mb-2">
              <Text className="text-white/40 font-medium">From</Text>
              <TouchableOpacity className="flex-row items-center gap-2">
                 <Text className="text-white font-bold">Main Wallet</Text>
                 <MaterialIcons name="keyboard-arrow-down" size={16} color="white" />
              </TouchableOpacity>
           </View>

           {/* Keypad */}
           <GlassPane className="rounded-[32px] p-4">
              <View className="flex-row gap-2 mb-2">
                 <KeypadButton value="1" label="1" />
                 <KeypadButton value="2" label="2" />
                 <KeypadButton value="3" label="3" />
              </View>
              <View className="flex-row gap-2 mb-2">
                 <KeypadButton value="4" label="4" />
                 <KeypadButton value="5" label="5" />
                 <KeypadButton value="6" label="6" />
              </View>
              <View className="flex-row gap-2 mb-2">
                 <KeypadButton value="7" label="7" />
                 <KeypadButton value="8" label="8" />
                 <KeypadButton value="9" label="9" />
              </View>
              <View className="flex-row gap-2 mb-4">
                 <KeypadButton value="." label="." />
                 <KeypadButton value="0" label="0" />
                 <KeypadButton value="backspace" icon="backspace" />
              </View>

              {/* Done Button */}
              <TouchableOpacity 
                 className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-primary/30 active:scale-[0.98]"
                 onPress={() => router.back()}
              >
                 <Text className="text-white font-bold text-lg font-display">Done</Text>
              </TouchableOpacity>
           </GlassPane>
        </View>
      </View>
    </ScreenWrapper>
  );
}
