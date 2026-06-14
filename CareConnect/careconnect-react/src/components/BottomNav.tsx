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
    <View style={{
      flexDirection: 'row',
      backgroundColor: C.surface,
      borderTopWidth: 1,
      borderTopColor: C.border,
      paddingBottom: insets.bottom,
      flexShrink: 0,
    }}>
      {tabs.map((tab, i) => {
        const active = i === currentIndex
        const Icon = tab.icon
        return (
          <TouchableOpacity
            key={i}
            onPress={() => onTap(i)}
            style={{
              flex: 1,
              alignItems: 'center',
              gap: 4,
              paddingVertical: 10,
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.75} color={active ? C.primary : C.textMuted} />
            <Text style={{ fontSize: 11, fontWeight: active ? '600' : '400', color: active ? C.primary : C.textMuted }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
