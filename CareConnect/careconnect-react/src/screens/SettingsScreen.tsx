import { useNavigate } from 'react-router-dom'
import { User, Bell, Shield, Accessibility, Palette, HelpCircle, ChevronRight, LogOut } from 'lucide-react'
import { useAccountStore } from '../store/accountStore'
import AppBar from '../components/AppBar'
import ContextBar from '../components/ContextBar'
import { C, T } from '../theme/styles'

const settingsSections = [
  {
    title: 'Account',
    items: [
      { icon: User,   label: 'My Profile',          route: '/profile' },
      { icon: Bell,   label: 'Notifications',        route: null },
      { icon: Shield, label: 'Privacy & Security',   route: null },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Accessibility, label: 'Accessibility',    route: null },
      { icon: Palette,       label: 'Appearance',        route: null },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & Support', route: null },
    ],
  },
]

export default function SettingsScreen() {
  const navigate = useNavigate()
  const { signOut } = useAccountStore()

  const handleSignOut = () => {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: C.background }}>
      <AppBar title="Settings" onBack={() => navigate(-1)} />
      <ContextBar label="Settings" />

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {settingsSections.map(section => (
          <div key={section.title} style={{ marginBottom: 20 }}>
            <p style={{ ...T.labelMedium, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, paddingLeft: 4 }}>
              {section.title}
            </p>
            <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              {section.items.map((item, i) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    onClick={() => item.route ? navigate(item.route) : undefined}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color={C.primary} />
                    </div>
                    <span style={{ ...T.bodyLarge, flex: 1, color: C.textPrimary }}>{item.label}</span>
                    <ChevronRight size={18} color={C.textMuted} />
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 16,
            background: C.redBg, border: `1px solid ${C.red}30`,
            display: 'flex', alignItems: 'center', gap: 14,
            cursor: 'pointer', color: C.red,
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.red + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={18} color={C.red} />
          </div>
          <span style={{ ...T.bodyLarge, color: C.red }}>Sign Out</span>
        </button>

        <p style={{ ...T.caption, textAlign: 'center', marginTop: 24 }}>CareConnect v1.0.0 — SWEN661 Team 8</p>
      </div>
    </div>
  )
}
