import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { User, Bell, Shield, Lock, Accessibility, Palette, HelpCircle, ChevronRight, LogOut } from 'lucide-react-native'
import { useAccountStore } from '../store/accountStore'
import AppBar from '../components/AppBar'
import ContextBar from '../components/ContextBar'
import { C, T } from '../theme/styles'
import type { RootStackParamList } from '../App'

type Nav = NativeStackNavigationProp<RootStackParamList>
type SettingsRoute = keyof RootStackParamList | null

const settingsSections = [
  {
    title: 'Account',
    items: [
      { icon: User,   label: 'My Profile',        route: 'Profile'  as SettingsRoute },
      { icon: Bell,   label: 'Notifications',      route: null       as SettingsRoute },
      { icon: Shield, label: 'Privacy & Security', route: null       as SettingsRoute },
      { icon: Lock,   label: 'PIN Login',          route: 'PinSetup' as SettingsRoute },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Accessibility, label: 'Accessibility', route: null as SettingsRoute },
      { icon: Palette,       label: 'Appearance',    route: null as SettingsRoute },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & Support', route: null as SettingsRoute },
    ],
  },
]

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>()
  const { signOut } = useAccountStore()

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <AppBar title="Settings" onBack={() => navigation.goBack()} />
      <ContextBar label="Settings" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {settingsSections.map(section => (
          <View key={section.title} style={{ marginBottom: 20 }}>
            <Text style={{ ...T.labelMedium, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, paddingLeft: 4 }}>
              {section.title}
            </Text>
            <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
              {section.items.map((item, i) => {
                const Icon = item.icon
                const isEnabled = Boolean(item.route)
                return (
                  <TouchableOpacity
                    key={item.label}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                    accessibilityHint={isEnabled ? `Open ${item.label}` : `${item.label} is not available yet`}
                    accessibilityState={{ disabled: !isEnabled }}
                    onPress={isEnabled ? () => navigation.navigate(item.route as keyof RootStackParamList) : undefined}
                    disabled={!isEnabled}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 14,
                      paddingVertical: 14, paddingHorizontal: 16,
                      opacity: isEnabled ? 1 : 0.5,
                      borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.border,
                    }}
                  >
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color={C.primary} />
                    </View>
                    <Text style={{ ...T.bodyLarge, flex: 1, color: C.textPrimary }}>{item.label}</Text>
                    <ChevronRight size={18} color={C.textMuted} />
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          accessibilityHint="Sign out of your CareConnect account"
          onPress={() => signOut()}
          style={{
            width: '100%', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16,
            backgroundColor: C.redBg, borderWidth: 1, borderColor: C.red + '30',
            flexDirection: 'row', alignItems: 'center', gap: 14,
          }}
        >
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.red + '18', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={18} color={C.red} />
          </View>
          <Text style={{ ...T.bodyLarge, color: C.red }}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={{ ...T.caption, textAlign: 'center', marginTop: 24 }}>CareConnect v1.0.0 — SWEN661 Team 8</Text>
      </ScrollView>
    </View>
  )
}