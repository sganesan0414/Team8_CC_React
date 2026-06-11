import { C } from '../theme/styles'

interface Props {
  label: string
}

export default function ContextBar({ label }: Props) {
  return (
    <div style={{
      background: C.surfaceVariant,
      borderBottom: `1px solid ${C.border}`,
      padding: '8px 20px',
      fontSize: 13,
      color: C.textMuted,
      fontWeight: 500,
    }}>
      {label}
    </div>
  )
}
