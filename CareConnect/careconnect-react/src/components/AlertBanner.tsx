import type { LucideIcon } from 'lucide-react'
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
    <div style={{
      background: C.alertBg,
      border: `1.5px solid ${C.alertBorder}`,
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
    }}>
      <Icon size={20} color={C.warning} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <p style={{ ...T.labelLarge, marginBottom: 2 }}>{title}</p>
        <p style={{ ...T.bodyMedium, fontSize: 14 }}>{body}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            style={{
              marginTop: 8,
              background: 'none',
              border: 'none',
              color: C.primary,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {actionLabel} →
          </button>
        )}
      </div>
    </div>
  )
}
