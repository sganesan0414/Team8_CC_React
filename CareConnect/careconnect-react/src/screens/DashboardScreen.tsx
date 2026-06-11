import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, LogOut } from 'lucide-react'
import { useAccountStore } from '../store/accountStore'
import BottomNav from '../components/BottomNav'
import ContextBar from '../components/ContextBar'
import ToastContainer from '../components/Toast'
import HomeTab from '../tabs/HomeTab'
import MedicationsTab from '../tabs/MedicationsTab'
import AppointmentsTab from '../tabs/AppointmentsTab'
import RemindersTab from '../tabs/RemindersTab'
import CareTeamTab from '../tabs/CareTeamTab'
import { C } from '../theme/styles'

const titles = ['CareConnect', 'My Medications', 'Appointments', 'Reminders', 'Care Team']
const contextLabels = [
  'Home - Daily Overview',
  'Home › My Medications',
  'Home › Appointments',
  'Home › Reminders',
  'Home › Care Team',
]

export default function DashboardScreen() {
  const navigate = useNavigate()
  const { signOut } = useAccountStore()
  const [navIndex, setNavIndex] = useState(0)

  const handleSignOut = () => {
    signOut()
    navigate('/login', { replace: true })
  }

  const tabs = [HomeTab, MedicationsTab, AppointmentsTab, RemindersTab, CareTeamTab]
  const ActiveTab = tabs[navIndex]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: C.background }}>
      {/* App Bar */}
      <header style={{
        background: C.primary,
        color: C.textOnPrimary,
        padding: '0 16px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <span style={{ flex: 1, fontSize: 20, fontWeight: 700 }}>{titles[navIndex]}</span>
        <button
          aria-label="Open settings"
          onClick={() => navigate('/settings')}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 8 }}
        >
          <Settings size={22} />
        </button>
        <button
          aria-label="Sign out"
          onClick={handleSignOut}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '8px 4px', fontSize: 14 }}
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </header>

      <ContextBar label={contextLabels[navIndex]} />

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', background: C.background }}>
        <ActiveTab onNavChange={setNavIndex} />
      </div>

      <BottomNav currentIndex={navIndex} onTap={setNavIndex} />
      <ToastContainer />
    </div>
  )
}
