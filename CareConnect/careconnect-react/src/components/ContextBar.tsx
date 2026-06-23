import { View, Text } from 'react-native'
import { C } from '../theme/styles'

interface Props {
  label: string
}

export default function ContextBar({ label }: Props) {
  return (
    <View
      accessible={true}
      accessibilityLabel={`Navigation breadcrumb: ${label}`}
      style={{
        backgroundColor: C.surfaceVariant,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        paddingVertical: 8,
        paddingHorizontal: 20,
      }}
    >
      <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '500' }}>{label}</Text>
    </View>
  )
}
