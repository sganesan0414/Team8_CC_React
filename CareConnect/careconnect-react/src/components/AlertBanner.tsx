import { View, Text, TouchableOpacity } from 'react-native'
import type { LucideIcon } from 'lucide-react-native'
import { C, T } from '../theme/styles'

interface Props {
  icon: LucideIcon
  title: string
  body: string
  actionLabel?: string
  onAction?: () => void
}

export default function AlertBanner({ icon: Icon, title, body, actionLabel, onAction }: Props) {
  return (
    <View style={{
      backgroundColor: C.alertBg,
      borderWidth: 1.5,
      borderColor: C.alertBorder,
      borderRadius: 14,
      padding: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-start',
    }}>
      <View style={{ flexShrink: 0, marginTop: 2 }}>
        <Icon size={20} color={C.warning} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ ...T.labelLarge, marginBottom: 2 }}>{title}</Text>
        <Text style={{ ...T.bodyMedium, fontSize: 14 }}>{body}</Text>
        {actionLabel && onAction && (
          <TouchableOpacity onPress={onAction} style={{ marginTop: 8 }}>
            <Text style={{ color: C.primary, fontWeight: '600', fontSize: 14 }}>{actionLabel} →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
