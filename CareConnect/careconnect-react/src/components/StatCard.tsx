import { View, Text } from 'react-native'
import type { LucideIcon } from 'lucide-react-native'
import { C, T } from '../theme/styles'

interface Props {
  icon: LucideIcon
  iconColor: string
  value: string
  label: string
}

export default function StatCard({ icon: Icon, iconColor, value, label }: Props) {
  return (
    <View style={{
      backgroundColor: C.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: C.border,
      padding: 14,
      paddingHorizontal: 12,
      gap: 6,
    }}>
      <View style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: iconColor + '18',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={18} color={iconColor} />
      </View>
      <Text style={{ ...T.headlineMedium, fontSize: 20 }}>{value}</Text>
      <Text style={{ ...T.caption }}>{label}</Text>
    </View>
  )
}
