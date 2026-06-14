import { View, Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { C } from '../theme/styles'

interface Props {
  title: string
  onBack?: () => void
  backLabel?: string
  actions?: React.ReactNode
}

export default function AppBar({ title, onBack, backLabel = 'Back', actions }: Props) {
  const insets = useSafeAreaInsets()

  return (
    <View style={{
      backgroundColor: C.primary,
      paddingTop: insets.top,
      paddingHorizontal: 16,
      height: 56 + insets.top,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flexShrink: 0,
    }}>
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 8, flexShrink: 0 }}
        >
          <ArrowLeft size={20} color={C.textOnPrimary} />
          <Text style={{ fontSize: 14, fontWeight: '500', color: C.textOnPrimary }}>{backLabel}</Text>
        </TouchableOpacity>
      )}
      <Text numberOfLines={1} style={{ flex: 1, fontSize: 20, fontWeight: '700', color: C.textOnPrimary }}>
        {title}
      </Text>
      {actions && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>{actions}</View>
      )}
    </View>
  )
}
