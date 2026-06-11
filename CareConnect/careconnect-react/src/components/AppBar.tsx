import { ArrowLeft } from 'lucide-react'
import { C } from '../theme/styles'

interface Props {
  title: string
  onBack?: () => void
  backLabel?: string
  actions?: React.ReactNode
}

export default function AppBar({ title, onBack, backLabel = 'Back', actions }: Props) {
  return (
    <header style={{
      background: C.primary,
      color: C.textOnPrimary,
      padding: '0 16px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexShrink: 0,
    }}>
      {onBack && (
        <button
          aria-label={backLabel}
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: C.textOnPrimary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '8px 0',
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={20} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>{backLabel}</span>
        </button>
      )}
      <span style={{ flex: 1, fontSize: 20, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {title}
      </span>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{actions}</div>}
    </header>
  )
}
