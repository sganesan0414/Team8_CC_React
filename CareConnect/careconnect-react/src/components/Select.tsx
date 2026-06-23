import { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { ChevronDown } from 'lucide-react-native'
import { C, inputBase } from '../theme/styles'

interface Props {
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
  placeholder?: string
  style?: object
}

export default function Select({ value, options, onChange, placeholder = 'Select…', style }: Props) {
  const [open, setOpen] = useState(false)
  const selectedLabel = options.find(o => o.value === value)?.label ?? placeholder

  return (
    <>
      <TouchableOpacity
        accessible={true}
        accessibilityRole="combobox"
        accessibilityLabel={`Select: ${selectedLabel}`}
        accessibilityHint={`Press to open list with ${options.length} options`}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
        style={[{ ...inputBase, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, style]}
      >
        <Text style={{ fontSize: 17, color: value ? C.textPrimary : C.textMuted, flex: 1 }}>
          {selectedLabel}
        </Text>
        <ChevronDown size={18} color={C.textMuted} />
      </TouchableOpacity>

      <Modal 
        visible={open} 
        transparent 
        animationType="slide" 
        onRequestClose={() => setOpen(false)}
        accessibilityLabel="Select options"
      >
        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Close select menu"
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}
          activeOpacity={1}
        />
        <View 
          accessible={false}
          style={{ backgroundColor: C.surface, borderRadius: 20, padding: 20, maxHeight: 320 }}
        >
          <Text 
            accessible={true}
            accessibilityRole="header"
            style={{ fontSize: 16, fontWeight: '600', color: C.textMuted, marginBottom: 12 }}
          >
            {placeholder}
          </Text>
          <ScrollView accessible={false}>
            {options.map(opt => (
              <TouchableOpacity
                key={opt.value}
                accessible={true}
                accessibilityRole="menuitem"
                accessibilityLabel={opt.label}
                accessibilityState={{ selected: value === opt.value }}
                accessibilityHint={`Select option: ${opt.label}`}
                onPress={() => { onChange(opt.value); setOpen(false) }}
                style={{ paddingVertical: 16, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.border, minHeight: 44 }}
              >
                <Text style={{
                  fontSize: 16,
                  color: value === opt.value ? C.primary : C.textPrimary,
                  fontWeight: value === opt.value ? '600' : '400',
                }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  )
}
