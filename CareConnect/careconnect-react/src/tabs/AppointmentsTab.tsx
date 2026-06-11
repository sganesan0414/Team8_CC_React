import { useState } from 'react'
import { Calendar, MapPin, CheckCircle, Clock, User, X, Edit2, Plus } from 'lucide-react'
import { useAppointmentsStore } from '../store/appointmentsStore'
import StatCard from '../components/StatCard'
import AlertBanner from '../components/AlertBanner'
import type { Appointment, AppointmentStatus } from '../types'
import { C, T } from '../theme/styles'

const MONTHS = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const FULL_MONTHS = ['','January','February','March','April','May','June','July','August','September','October','November','December']

function formatTime(dt: Date) {
  const h = dt.getHours() % 12 || 12
  const m = String(dt.getMinutes()).padStart(2, '0')
  return `${h}:${m} ${dt.getHours() >= 12 ? 'PM' : 'AM'}`
}

interface Props { onNavChange: (i: number) => void }

export default function AppointmentsTab({ onNavChange: _ }: Props) {
  const { appointments, cancelAppointment, addAppointment } = useAppointmentsStore()
  const upcoming = appointments.filter(a => a.status === 'upcoming')
  const completed = appointments.filter(a => a.status === 'completed')
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDoctor, setNewDoctor] = useState('')
  const [newSpecialty, setNewSpecialty] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newLocation, setNewLocation] = useState('')

  const now = new Date()
  const soonAppts = upcoming.filter(a => {
    const diff = (a.dateTime.getTime() - now.getTime()) / (1000 * 3600)
    return diff <= 24 && diff > 0
  })

  const handleAdd = () => {
    if (!newDoctor || !newDate) return
    addAppointment({
      doctorName: newDoctor,
      specialty: newSpecialty || 'General',
      dateTime: new Date(newDate),
      location: newLocation || 'TBD',
      notes: '',
      status: 'upcoming',
    })
    setShowAddForm(false)
    setNewDoctor(''); setNewSpecialty(''); setNewDate(''); setNewLocation('')
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        <StatCard icon={Calendar}     iconColor={C.primary}  value={String(appointments.length)} label="Total" />
        <StatCard icon={Clock}        iconColor={C.warning}  value={String(upcoming.length)}     label="Upcoming" />
        <StatCard icon={CheckCircle}  iconColor={C.success}  value={String(completed.length)}    label="Completed" />
      </div>

      {soonAppts.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <AlertBanner
            icon={Calendar}
            title="Appointment Soon"
            body={`${soonAppts[0].doctorName} - ${soonAppts[0].specialty} is within 24 hours.`}
            actionLabel="View Details"
            onAction={() => setSelectedAppt(soonAppts[0])}
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ ...T.headlineMedium }}>Your Appointments</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: C.primary, border: 'none', color: 'white', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600 }}>
          <Plus size={16} />Add
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <h3 style={{ ...T.titleLarge, marginBottom: 12 }}>New Appointment</h3>
          {[
            { label: 'Doctor Name', value: newDoctor, setter: setNewDoctor, type: 'text', placeholder: 'Dr. Jane Smith' },
            { label: 'Specialty',   value: newSpecialty, setter: setNewSpecialty, type: 'text', placeholder: 'Primary Care' },
            { label: 'Date & Time', value: newDate, setter: setNewDate, type: 'datetime-local', placeholder: '' },
            { label: 'Location',   value: newLocation, setter: setNewLocation, type: 'text', placeholder: 'City Medical Center' },
          ].map(f => (
            <label key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
              <span style={{ ...T.labelMedium }}>{f.label}</span>
              <input type={f.type} value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder}
                style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.surfaceVariant, fontSize: 15, outline: 'none' }} />
            </label>
          ))}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleAdd} disabled={!newDoctor || !newDate} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: C.primary, color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: (!newDoctor || !newDate) ? 0.5 : 1 }}>Add Appointment</button>
            <button onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          </div>
        </div>
      )}

      {appointments.map(appt => (
        <ApptTile key={appt.id} appointment={appt} onTap={() => setSelectedAppt(appt)} />
      ))}

      {/* Detail modal */}
      {selectedAppt && (
        <DetailModal appt={selectedAppt} onClose={() => setSelectedAppt(null)} onCancel={() => { cancelAppointment(selectedAppt.id); setSelectedAppt(null) }} />
      )}
    </div>
  )
}

function statusStyle(status: AppointmentStatus) {
  const map = {
    upcoming:  { border: C.primary, bg: C.infoBg,       badge: C.primary,  label: 'Upcoming' },
    completed: { border: C.success, bg: C.successBg,    badge: C.success,  label: 'Done' },
    cancelled: { border: C.border,  bg: C.surfaceVariant, badge: C.textMuted, label: 'Cancelled' },
  }
  return map[status]
}

function ApptTile({ appointment: a, onTap }: { appointment: Appointment; onTap: () => void }) {
  const st = statusStyle(a.status)
  const dt = a.dateTime
  const dateStr = `${FULL_MONTHS[dt.getMonth() + 1]} ${dt.getDate()}, ${dt.getFullYear()}`
  const timeStr = formatTime(dt)

  return (
    <button
      onClick={onTap}
      aria-label={`${a.doctorName}, ${a.specialty}, ${dateStr} at ${timeStr}`}
      style={{ width: '100%', background: st.bg, border: `1.5px solid ${st.border}`, borderRadius: 16, padding: 16, marginBottom: 12, cursor: 'pointer', textAlign: 'left', display: 'block' }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: st.border + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <User size={22} color={st.border} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ ...T.labelLarge }}>{a.doctorName}</p>
          <p style={{ ...T.bodyMedium }}>{a.specialty}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Calendar size={13} color={C.textMuted} />
            <span style={{ ...T.caption }}>{dateStr}  {timeStr}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={13} color={C.textMuted} />
            <span style={{ ...T.caption, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{a.location}</span>
          </div>
        </div>
        <span style={{ background: st.badge + '18', border: `1px solid ${st.badge}`, color: st.badge, borderRadius: 20, padding: '3px 8px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
          {st.label}
        </span>
      </div>
    </button>
  )
}

function DetailModal({ appt: a, onClose, onCancel }: { appt: Appointment; onClose: () => void; onCancel: () => void }) {
  const dt = a.dateTime
  const dateStr = `${FULL_MONTHS[dt.getMonth() + 1]} ${dt.getDate()}, ${dt.getFullYear()}`

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
      <div style={{ position: 'relative', background: C.surface, borderRadius: '20px 20px 0 0', padding: '24px 24px 32px', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, margin: '0 auto 20px' }} />
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted }}>
          <X size={22} />
        </button>

        <h2 style={{ ...T.headlineMedium, marginBottom: 4 }}>{a.doctorName}</h2>
        <p style={{ ...T.bodyMedium, marginBottom: 16 }}>{a.specialty}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Calendar size={16} color={C.textMuted} />
          <span style={{ ...T.bodyMedium }}>{dateStr} at {formatTime(dt)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <MapPin size={16} color={C.textMuted} />
          <span style={{ ...T.bodyMedium }}>{a.location}</span>
        </div>
        {a.notes && (
          <>
            <p style={{ ...T.labelLarge, marginBottom: 4 }}>Notes</p>
            <p style={{ ...T.bodyMedium, marginBottom: 16 }}>{a.notes}</p>
          </>
        )}

        {a.status === 'upcoming' && (
          <>
            <button style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: `1.5px solid ${C.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 600, fontSize: 15, marginBottom: 10 }}>
              <Edit2 size={16} />Reschedule
            </button>
            <button
              onClick={onCancel}
              style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: `1.5px solid ${C.red}`, background: C.redBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 600, fontSize: 15, color: C.red }}>
              <X size={16} />Cancel Appointment
            </button>
          </>
        )}
      </div>
    </div>
  )
}
