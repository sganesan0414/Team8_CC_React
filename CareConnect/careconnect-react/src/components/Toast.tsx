import { useState, useCallback, useEffect } from 'react'
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
    <div style={{
      position: 'fixed',
      bottom: 80,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(440px, calc(100vw - 32px))',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      zIndex: 1000,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: C.textPrimary,
          color: C.textOnPrimary,
          borderRadius: 12,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          pointerEvents: 'all',
        }}>
          <span style={{ fontSize: 15 }}>{t.message}</span>
          {t.action && (
            <button
              onClick={t.action.onClick}
              style={{ background: 'none', border: 'none', color: '#93C5FD', fontWeight: 600, fontSize: 14, cursor: 'pointer', flexShrink: 0 }}
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
