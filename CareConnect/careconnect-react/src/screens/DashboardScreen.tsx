import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Settings, LogOut } from 'lucide-react-native'
import { useAccountStore } from '../store/accountStore'
import BottomNav from '../components/BottomNav'
import ContextBar from '../components/ContextBar'
import ToastContainer from '../components/Toast'
import HomeTab from '../tabs/HomeTab'
import MedicationsTab from '../tabs/MedicationsTab'
import AppointmentsTab from '../tabs/AppointmentsTab'
import RemindersTab from '../tabs/RemindersTab'
import CareTeamTab from '../tabs/CareTeamTab'
import { C } from '../theme/styles'
import type { RootStackParamList } from '../App'
import { ScrollView } from 'react-native'

type Nav = NativeStackNavigationProp<RootStackParamList>

const titles = ['CareConnect', 'My Medications', 'Appointments', 'Reminders', 'Care Team']
const contextLabels = [
  'Home - Daily Overview',
  'Home › My Medications',
  'Home › Appointments',
  'Home › Reminders',
  'Home › Care Team',
]

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const { signOut } = useAccountStore()
  const [navIndex, setNavIndex] = useState(0)

  const tabs = [HomeTab, MedicationsTab, AppointmentsTab, RemindersTab, CareTeamTab]
  const ActiveTab = tabs[navIndex]

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      {/* Header */}
      <View style={{
        backgroundColor: C.primary,
        paddingTop: insets.top,
        height: 56 + insets.top,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}>
        <Text 
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel={`Page: ${titles[navIndex]}`}
          style={{ flex: 1, fontSize: 20, fontWeight: '700', color: 'white' }}
        >
          {titles[navIndex]}
        </Text>
        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          accessibilityHint="Tap to open settings menu"
          onPress={() => navigation.navigate('Settings')}
          style={{ padding: 11, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <Settings size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          accessibilityHint="Tap to sign out of your account"
          onPress={() => signOut()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 8 }}
        >
          <LogOut size={18} color="white" />
          <Text style={{ color: 'white', fontSize: 14 }}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <ContextBar label={contextLabels[navIndex]} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <ActiveTab onNavChange={setNavIndex} />
      </ScrollView>

      <BottomNav currentIndex={navIndex} onTap={setNavIndex} />
      <ToastContainer />
    </View>
  )
}
