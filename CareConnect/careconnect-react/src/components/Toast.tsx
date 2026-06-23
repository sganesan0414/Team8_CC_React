import { useState, useCallback, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { C } from '../theme/styles'

interface ToastItem {
  id: number
  message: string
  action?: { label: string; onClick: () => void }
}

let addToastFn: ((msg: string, action?: ToastItem['action']) => void) | null = null

export function showToast(message: string, action?: ToastItem['action']) {
  addToastFn?.(message, action)
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const add = useCallback((message: string, action?: ToastItem['action']) => {
    const id = Date.now()
    setToasts(ts => [...ts, { id, message, action }])
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 5000)
  }, [])

  useEffect(() => {
    addToastFn = add
    return () => { addToastFn = null }
  }, [add])

  return (
    <View
      accessible={false}
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        bottom: 80,
        left: 16,
        right: 16,
        gap: 8,
        zIndex: 1000,
      }}
    >
      {toasts.map(t => (
        <View 
          key={t.id}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLabel={t.message}
          accessibilityLiveRegion="polite"
          importantForAccessibility="yes"
          style={{
            backgroundColor: C.textPrimary,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            elevation: 4,
          }}
        >
          <Text style={{ fontSize: 15, color: C.textOnPrimary, flex: 1 }}>{t.message}</Text>
          {t.action && (
            <TouchableOpacity 
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t.action.label}
              accessibilityHint="Perform action for this message"
              onPress={t.action.onClick} 
              style={{ flexShrink: 0, paddingVertical: 4, paddingHorizontal: 2 }}
            >
              <Text style={{ color: C.primary, fontWeight: '600', fontSize: 14 }}>{t.action.label}</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  )
}
