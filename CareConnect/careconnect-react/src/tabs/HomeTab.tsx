import { useNavigate } from 'react-router-dom'
import { Pill, Calendar, Heart, FileText, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react'
import { useAccountStore } from '../store/accountStore'
import { useMedicationsStore } from '../store/medicationsStore'
import { useAppointmentsStore } from '../store/appointmentsStore'
import AlertBanner from '../components/AlertBanner'
import { C, T } from '../theme/styles'

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatTime(dt: Date) {
  const h = dt.getHours() % 12 || 12
  const m = String(dt.getMinutes()).padStart(2, '0')
  return `${h}:${m} ${dt.getHours() >= 12 ? 'PM' : 'AM'}`
}

interface Props { onNavChange: (i: number) => void }

export default function HomeTab({ onNavChange }: Props) {
  const navigate = useNavigate()
  const { displayName } = useAccountStore()
  const { medications } = useMedicationsStore()
  const { appointments } = useAppointmentsStore()
  const upcomingAppts = appointments.filter(a => a.status === 'upcoming')

  const name = displayName || 'there'
  const now = new Date()
  const todayLabel = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`
  const nextAppt = upcomingAppts[0] ?? null
  const takenCount = medications.filter(m => m.taken).length
  const unTakenMeds = medications.filter(m => !m.taken).slice(0, 3)

  const quickActions = [
    { icon: Pill,       label: 'My\nMedications', color: C.primary,  onClick: () => onNavChange(1) },
    { icon: Calendar,   label: 'Appointments',   color: C.purple,   onClick: () => onNavChange(2) },
    { icon: Heart,      label: 'Health\nMetrics', color: '#B0193C',  onClick: () => navigate('/health-metrics') },
    { icon: FileText,   label: 'Reports',        color: C.success,  onClick: () => navigate('/health-reports') },
    { icon: ShoppingBag,label: 'Pharmacy',       color: '#816FC9',   onClick: () => navigate('/pharmacy') },
  ]

  return (
    <div style={{ padding: 20 }}>
      {/* Hero banner */}
      <div style={{ background: C.primary, borderRadius: 20, padding: 24, marginBottom: 24 }}>
        <button
          onClick={() => navigate('/profile')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'block', textAlign: 'left', marginBottom: 4 }}
          aria-label={`Open profile for ${name}`}
        >
          <span style={{ ...T.displayLarge, color: 'white', display: 'block' }}>Good Morning, {name}</span>
        </button>
        <p style={{ ...T.bodyMedium, color: 'rgba(255,255,255,0.75)', marginBottom: 20 }}>{todayLabel}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { icon: Pill,        value: `${takenCount}/${medications.length}`, label: 'Medications\nToday',   color: C.accent },
            { icon: TrendingUp,  value: '94%',                                label: 'Adherence\nRate',       color: C.success },
            { icon: Calendar,    value: nextAppt ? `${SHORT_MONTHS[nextAppt.dateTime.getMonth()]} ${nextAppt.dateTime.getDate()}` : 'None', label: 'Next\nAppointment', color: C.accent },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <Icon size={14} color="white" />
              </div>
              <p style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 2 }}>{value}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-line', lineHeight: 1.3 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ ...T.headlineMedium, marginBottom: 14 }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {quickActions.map(({ icon: Icon, label, color, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
              padding: '20px 16px', cursor: 'pointer', textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 10, aspectRatio: '1 / 0.9',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={22} color={color} />
            </div>
            <span style={{ ...T.labelLarge, whiteSpace: 'pre-line', lineHeight: 1.3 }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Alert banner */}
      <AlertBanner
        icon={AlertTriangle}
        title="Refill Reminder"
        body="Atorvastatin has only 2 refills remaining. Request a refill soon."
        actionLabel="Request Refill"
        onAction={() => navigate('/pharmacy')}
      />

      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ ...T.headlineMedium }}>Upcoming Medications</h2>
          <button onClick={() => onNavChange(1)} style={{ background: 'none', border: 'none', color: C.primary, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>View All</button>
        </div>

        {unTakenMeds.length === 0
          ? <p style={{ ...T.bodyMedium }}>All medications taken for today!</p>
          : unTakenMeds.map(med => (
            <div key={med.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.warningBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Pill size={18} color={C.warning} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ ...T.labelLarge }}>{med.name}</p>
                <p style={{ ...T.bodyMedium }}>{med.dose}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ ...T.titleLarge, color: C.warning, fontSize: 16 }}>{med.times[0]}</p>
                <p style={{ ...T.caption, color: C.warning }}>Due soon</p>
              </div>
            </div>
          ))
        }
      </div>

      {/* Next Appointment */}
      <div style={{ marginTop: 24, marginBottom: 32 }}>
        <h2 style={{ ...T.headlineMedium, marginBottom: 12 }}>Next Appointment</h2>
        {nextAppt ? (
          <div style={{ background: C.infoBg, border: `1.5px solid ${C.primary}30`, borderRadius: 16, padding: 18 }}>
            <p style={{ ...T.titleLarge, marginBottom: 2 }}>{nextAppt.doctorName}</p>
            <p style={{ ...T.bodyMedium, marginBottom: 12 }}>{nextAppt.specialty}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Calendar size={14} color={C.textMuted} />
              <span style={{ ...T.bodyMedium }}>
                {MONTHS[nextAppt.dateTime.getMonth()]} {nextAppt.dateTime.getDate()}, {nextAppt.dateTime.getFullYear()}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <Pill size={14} color={C.textMuted} />
              <span style={{ ...T.bodyMedium }}>{formatTime(nextAppt.dateTime)}</span>
            </div>
            <button
              onClick={() => onNavChange(2)}
              style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.textPrimary, cursor: 'pointer', fontWeight: 600, fontSize: 15 }}
            >
              View All Appointments
            </button>
          </div>
        ) : (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, textAlign: 'center' }}>
            <p style={{ ...T.bodyMedium }}>No upcoming appointments.</p>
          </div>
        )}
      </div>
    </div>
  )
}
