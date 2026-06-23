import { View, Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Home, Pill, Calendar, Bell, Users } from 'lucide-react-native'
import { C } from '../theme/styles'

const tabs = [
  { icon: Home,     label: 'Home' },
  { icon: Pill,     label: 'Medications' },
  { icon: Calendar, label: 'Appointments' },
  { icon: Bell,     label: 'Reminders' },
  { icon: Users,    label: 'Care Team' },
]

interface Props {
  currentIndex: number
  onTap: (index: number) => void
}

export default function BottomNav({ currentIndex, onTap }: Props) {
  const insets = useSafeAreaInsets()

  return (
    <View
      accessible={false}
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row',
        backgroundColor: C.surface,
        borderTopWidth: 1,
        borderTopColor: C.border,
        paddingBottom: insets.bottom,
        flexShrink: 0,
      }}
    >
      {tabs.map((tab, i) => {
        const active = i === currentIndex
        const Icon = tab.icon
        return (
          <TouchableOpacity
            key={i}
            accessible={true}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityHint={`Tap to navigate to ${tab.label}`}
            accessibilityState={{ selected: active }}
            onPress={() => onTap(i)}
            style={{
              flex: 1,
              alignItems: 'center',
              gap: 4,
              paddingVertical: 14,
              paddingHorizontal: 8,
              minHeight: 60,
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.75} color={active ? C.primary : '#4B5563'} />
            <Text style={{ fontSize: 11, fontWeight: active ? '600' : '400', color: active ? C.primary : '#4B5563' }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
