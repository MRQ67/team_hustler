import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Image, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import GlassPane from '../../components/GlassPane';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useFinancialData } from '../../hooks/useFinancialData';
import { useCurrencyStore } from '../../store/currencyStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { savingsGoals } = useFinancialData(); // Get savings goals to potentially show a count
  const { selectedCurrency, setSelectedCurrency: setGlobalSelectedCurrency } = useCurrencyStore();

  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  const handleSavingsGoalsPress = () => {
    // Navigate to the savings goals modal
    router.push('/modal/savings-goal');
  };

  return (
    <ScreenWrapper>
       {/* Header */}
      <View className="flex-row items-center justify-between p-6 pt-8 z-20">
        <Text className="text-2xl font-bold tracking-tight text-white/90 font-display">Settings</Text>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center active:bg-white/10">
          <MaterialIcons name="search" size={24} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-4 gap-6 pb-32">
        {/* Profile Section */}
        <GlassPane className="rounded-3xl p-5 relative overflow-hidden group">
           <View className="absolute top-0 right-0 p-4 opacity-50 transform translate-x-2 -translate-y-2">
              <MaterialIcons name="fingerprint" size={60} color="rgba(255,255,255,0.1)" style={{ transform: [{ rotate: '12deg' }] }} />
           </View>
           <View className="flex-row items-center gap-4 relative z-10">
              <View className="relative shrink-0">
                 <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10">
                    <Image 
                       source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.user_metadata?.name || 'User') + '&background=random' }} 
                       className="w-full h-full"
                    />
                 </View>
                 <View className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-[#1f1313] items-center justify-center">
                    <MaterialIcons name="edit" size={10} color="white" />
                 </View>
              </View>
              <View>
                 <Text className="text-lg font-bold text-white leading-tight font-display">{user?.user_metadata?.name || 'Alex Morgan'}</Text>
                 <Text className="text-white/50 text-sm font-medium font-body">{user?.email || 'alex.morgan@finance.app'}</Text>
                 <TouchableOpacity className="mt-2 flex-row items-center gap-1">
                    <Text className="text-accent text-xs font-semibold tracking-wide uppercase font-body">Edit Profile</Text>
                    <MaterialIcons name="arrow-forward" size={14} color="#F9E7B2" />
                 </TouchableOpacity>
              </View>
           </View>
        </GlassPane>

        {/* Group: Preferences */}
        <View className="gap-3">
           <Text className="px-2 text-sm font-semibold text-white/40 uppercase tracking-wider font-display">Preferences</Text>
           <GlassPane className="rounded-2xl overflow-hidden flex-col">
              {/* Item 1 */}
              <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-white/5 border-b border-white/5">
                 <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 items-center justify-center shadow-inner">
                       <MaterialIcons name="dark-mode" size={20} color="#F9E7B2" />
                    </View>
                    <Text className="text-white/90 font-medium font-body">Dark Mode</Text>
                 </View>
                 <Switch 
                    value={darkMode} 
                    onValueChange={setDarkMode}
                    trackColor={{ false: "#3e3e3e", true: "#D34E4E" }}
                    thumbColor={darkMode ? "#fff" : "#f4f3f4"}
                 />
              </TouchableOpacity>
              {/* Item 2 */}
              <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-white/5 border-b border-white/5" onPress={() => setShowNotificationModal(true)}>
                 <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 items-center justify-center shadow-inner">
                       <MaterialIcons name="notifications" size={20} color="rgba(211, 78, 78, 0.8)" />
                    </View>
                    <Text className="text-white/90 font-medium font-body">Notifications</Text>
                 </View>
                 <View className="flex-row items-center gap-2">
                    <Text className={`text-sm font-body ${notificationsEnabled ? 'text-accent' : 'text-white/40'}`}>
                      {notificationsEnabled ? 'On' : 'Off'}
                    </Text>
                    <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.2)" />
                 </View>
              </TouchableOpacity>
              {/* Item 3 */}
              <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-white/5" onPress={() => setShowCurrencyModal(true)}>
                 <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 items-center justify-center shadow-inner">
                       <MaterialIcons name="payments" size={20} color="#818cf8" />
                    </View>
                    <Text className="text-white/90 font-medium font-body">Currency</Text>
                 </View>
                 <View className="flex-row items-center gap-2">
                    <Text className="text-white/40 text-sm font-body">{selectedCurrency}</Text>
                    <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.2)" />
                 </View>
              </TouchableOpacity>
           </GlassPane>
        </View>


        {/* Group: Financial Goals */}
        <View className="gap-3">
           <Text className="px-2 text-sm font-semibold text-white/40 uppercase tracking-wider font-display">Financial Goals</Text>
           <GlassPane className="rounded-2xl overflow-hidden flex-col">
              <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-white/5" onPress={handleSavingsGoalsPress}>
                 <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 items-center justify-center shadow-inner">
                       <MaterialIcons name="savings" size={20} color="#34d399" />
                    </View>
                    <Text className="text-white/90 font-medium font-body">Savings Goals</Text>
                 </View>
                 <View className="flex-row items-center">
                   {savingsGoals && savingsGoals.length > 0 && (
                     <Text className="text-white/50 text-xs mr-2">{savingsGoals.length}</Text>
                   )}
                   <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.2)" />
                 </View>
              </TouchableOpacity>
           </GlassPane>
        </View>

        {/* Group: Data */}
        <View className="gap-3">
           <Text className="px-2 text-sm font-semibold text-white/40 uppercase tracking-wider font-display">Data</Text>
           <GlassPane className="rounded-2xl overflow-hidden flex-col">
              <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-white/5">
                 <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 items-center justify-center shadow-inner">
                       <MaterialIcons name="download" size={20} color="#60a5fa" />
                    </View>
                    <Text className="text-white/90 font-medium font-body">Export CSV</Text>
                 </View>
              </TouchableOpacity>
           </GlassPane>
        </View>

        {/* Group: Android Features */}
        {Platform.OS === 'android' && (
          <View className="gap-3">
             <Text className="px-2 text-sm font-semibold text-white/40 uppercase tracking-wider font-display">Android Features</Text>
             <GlassPane className="rounded-2xl overflow-hidden flex-col">
                <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-white/5">
                   <View className="flex-row items-center gap-4">
                      <View className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 items-center justify-center shadow-inner">
                         <MaterialIcons name="sms" size={20} color="#F9E7B2" />
                      </View>
                      <Text className="text-white/90 font-medium font-body">SMS Transaction Parsing</Text>
                   </View>
                   <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.2)" />
                </TouchableOpacity>
             </GlassPane>
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity 
           className="w-full rounded-2xl p-4 bg-white/5 border border-white/10 items-center justify-center flex-row gap-2 active:bg-primary/10 mt-2"
           onPress={handleSignOut}
        >
           <MaterialIcons name="logout" size={20} color="#D34E4E" />
           <Text className="font-bold text-primary font-display">Log Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <View className="items-center pb-8 pt-4">
           <Text className="text-white/20 text-xs font-medium font-body">Version 2.4.0</Text>
        </View>
      </View>

      {/* Currency Selection Modal */}
      {showCurrencyModal && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center z-50 p-4">
          <GlassPane className="w-full max-w-md rounded-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-white font-display">Select Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-60">
              {['USD ($)', 'EUR (€)', 'GBP (£)', 'ETB (Br)', 'JPY (¥)', 'CNY (¥)', 'INR (₹)', 'CAD (C$)', 'AUD (A$)'].map((currency) => (
                <TouchableOpacity
                  key={currency}
                  className={`flex-row items-center justify-between p-4 rounded-xl mb-2 ${selectedCurrency === currency.split(' ')[0] ? 'bg-primary/20' : 'bg-white/5'}`}
                  onPress={() => {
                    setGlobalSelectedCurrency(currency.split(' ')[0]);
                    setShowCurrencyModal(false);
                  }}
                >
                  <Text className={`font-medium ${selectedCurrency === currency.split(' ')[0] ? 'text-white' : 'text-white/70'}`}>
                    {currency}
                  </Text>
                  {selectedCurrency === currency.split(' ')[0] && (
                    <MaterialIcons name="check" size={20} color="#F9E7B2" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </GlassPane>
        </View>
      )}

      {/* Notification Settings Modal */}
      {showNotificationModal && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center z-50 p-4">
          <GlassPane className="w-full max-w-md rounded-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-white font-display">Notification Settings</Text>
              <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <TouchableOpacity
                className="flex-row items-center justify-between p-4 rounded-xl bg-white/5"
                onPress={() => {
                  setNotificationsEnabled(!notificationsEnabled);
                }}
              >
                <Text className="font-medium text-white">Enable Notifications</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#3e3e3e", true: "#D34E4E" }}
                  thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
                />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-between p-4 rounded-xl bg-white/5">
                <Text className="font-medium text-white">Budget Alerts</Text>
                <Switch
                  value={true}
                  trackColor={{ false: "#3e3e3e", true: "#D34E4E" }}
                  thumbColor="#f4f3f4"
                />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-between p-4 rounded-xl bg-white/5">
                <Text className="font-medium text-white">Transaction Alerts</Text>
                <Switch
                  value={true}
                  trackColor={{ false: "#3e3e3e", true: "#D34E4E" }}
                  thumbColor="#f4f3f4"
                />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-between p-4 rounded-xl bg-white/5">
                <Text className="font-medium text-white">Monthly Reports</Text>
                <Switch
                  value={true}
                  trackColor={{ false: "#3e3e3e", true: "#D34E4E" }}
                  thumbColor="#f4f3f4"
                />
              </TouchableOpacity>
            </View>
          </GlassPane>
        </View>
      )}
    </ScreenWrapper>
  );
}