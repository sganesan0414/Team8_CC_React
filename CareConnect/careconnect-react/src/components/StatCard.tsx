import type { LucideIcon } from 'lucide-react'
import { C, T } from '../theme/styles'

interface Props {
  icon: LucideIcon
  iconColor: string
  value: string
  label: string
}

export default function StatCard({ icon: Icon, iconColor, value, label }: Props) {
  return (
    <div style={{
      background: C.surface,
      borderRadius: 14,
      border: `1px solid ${C.border}`,
      padding: '14px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: iconColor + '18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={18} color={iconColor} />
      </div>
      <span style={{ ...T.headlineMedium, fontSize: 20 }}>{value}</span>
      <span style={{ ...T.caption }}>{label}</span>
    </div>
  )
}
