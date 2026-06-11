import { Home, Pill, Calendar, Bell, Users } from 'lucide-react'
import { C } from '../theme/styles'

const tabs = [
  { icon: Home,     label: 'Home' },
  { icon: Pill,     label: 'Medications' },
  { icon: Calendar, label: 'Appointments' },
  { icon: Bell,     label: 'Reminders' },
  { icon: Users,    label: 'Care Team' },
]

interface Props {
  currentIndex: number
  onTap: (index: number) => void
}

export default function BottomNav({ currentIndex, onTap }: Props) {
  return (
    <nav style={{
      display: 'flex',
      background: C.surface,
      borderTop: `1px solid ${C.border}`,
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
      flexShrink: 0,
    }}>
      {tabs.map((tab, i) => {
        const active = i === currentIndex
        const Icon = tab.icon
        return (
          <button
            key={i}
            aria-label={tab.label}
            aria-current={active ? 'page' : undefined}
            onClick={() => onTap(i)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? C.primary : C.textMuted,
              transition: 'color 0.15s',
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.75} />
            <span style={{ fontSize: 11, fontWeight: active ? 600 : 400 }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
