import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native'
import { Calendar, MapPin, CheckCircle, Clock, User, X, Edit2, Plus } from 'lucide-react-native'
import { useAppointmentsStore } from '../store/appointmentsStore'
import StatCard from '../components/StatCard'
import AlertBanner from '../components/AlertBanner'
import type { Appointment, AppointmentStatus } from '../types'
import { C, T } from '../theme/styles'

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
    <View style={{ padding: 20 }}>
      {/* Stats */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <View style={{ flex: 1 }}><StatCard icon={Calendar}    iconColor={C.primary} value={String(appointments.length)} label="Total" /></View>
        <View style={{ flex: 1 }}><StatCard icon={Clock}       iconColor={C.warning} value={String(upcoming.length)} label="Upcoming" /></View>
        <View style={{ flex: 1 }}><StatCard icon={CheckCircle} iconColor={C.success} value={String(completed.length)} label="Completed" /></View>
      </View>

      {soonAppts.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <AlertBanner
            icon={Calendar}
            title="Appointment Soon"
            body={`${soonAppts[0].doctorName} - ${soonAppts[0].specialty} is within 24 hours.`}
            actionLabel="View Details"
            onAction={() => setSelectedAppt(soonAppts[0])}
          />
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ ...T.headlineMedium }}>Your Appointments</Text>
        <TouchableOpacity
          onPress={() => setShowAddForm(!showAddForm)}
          style={{ backgroundColor: C.primary, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}
        >
          <Plus size={16} color="white" />
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Add</Text>
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ ...T.titleLarge, marginBottom: 12 }}>New Appointment</Text>
          {[
            { label: 'Doctor Name', value: newDoctor,    setter: setNewDoctor,    placeholder: 'Dr. Jane Smith',      keyboard: 'default' as const },
            { label: 'Specialty',   value: newSpecialty, setter: setNewSpecialty, placeholder: 'Primary Care',        keyboard: 'default' as const },
            { label: 'Date & Time', value: newDate,      setter: setNewDate,      placeholder: 'YYYY-MM-DDTHH:MM',    keyboard: 'numbers-and-punctuation' as const },
            { label: 'Location',    value: newLocation,  setter: setNewLocation,  placeholder: 'City Medical Center', keyboard: 'default' as const },
          ].map(f => (
            <View key={f.label} style={{ gap: 4, marginBottom: 10 }}>
              <Text style={{ ...T.labelMedium }}>{f.label}</Text>
              <TextInput
                value={f.value}
                onChangeText={f.setter}
                placeholder={f.placeholder}
                keyboardType={f.keyboard}
                style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.surfaceVariant, fontSize: 15 }}
              />
            </View>
          ))}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={handleAdd}
              disabled={!newDoctor || !newDate}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', opacity: (!newDoctor || !newDate) ? 0.5 : 1 }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Add Appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowAddForm(false)}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, backgroundColor: 'transparent', alignItems: 'center' }}
            >
              <Text style={{ fontWeight: '600', color: C.textPrimary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {appointments.map(appt => (
        <ApptTile key={appt.id} appointment={appt} onTap={() => setSelectedAppt(appt)} />
      ))}

      {selectedAppt && (
        <DetailModal
          appt={selectedAppt}
          onClose={() => setSelectedAppt(null)}
          onCancel={() => { cancelAppointment(selectedAppt.id); setSelectedAppt(null) }}
        />
      )}
    </View>
  )
}

function statusStyle(status: AppointmentStatus) {
  const map = {
    upcoming:  { border: C.primary,   bg: C.infoBg,         badge: C.primary,  label: 'Upcoming' },
    completed: { border: C.success,   bg: C.successBg,      badge: C.success,  label: 'Done' },
    cancelled: { border: C.border,    bg: C.surfaceVariant,  badge: C.textMuted, label: 'Cancelled' },
  }
  return map[status]
}

function ApptTile({ appointment: a, onTap }: { appointment: Appointment; onTap: () => void }) {
  const st = statusStyle(a.status)
  const dt = a.dateTime
  const dateStr = `${FULL_MONTHS[dt.getMonth() + 1]} ${dt.getDate()}, ${dt.getFullYear()}`
  const timeStr = formatTime(dt)

  return (
    <TouchableOpacity
      onPress={onTap}
      style={{ width: '100%', backgroundColor: st.bg, borderWidth: 1.5, borderColor: st.border, borderRadius: 16, padding: 16, marginBottom: 12 }}
    >
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: st.border + '20', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <User size={22} color={st.border} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...T.labelLarge }}>{a.doctorName}</Text>
          <Text style={{ ...T.bodyMedium }}>{a.specialty}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Calendar size={13} color={C.textMuted} />
            <Text style={{ ...T.caption }}>{dateStr}  {timeStr}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MapPin size={13} color={C.textMuted} />
            <Text numberOfLines={1} style={{ ...T.caption, maxWidth: 180 }}>{a.location}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: st.badge + '18', borderWidth: 1, borderColor: st.badge, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 8, flexShrink: 0 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: st.badge }}>{st.label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function DetailModal({ appt: a, onClose, onCancel }: { appt: Appointment; onClose: () => void; onCancel: () => void }) {
  const dt = a.dateTime
  const dateStr = `${FULL_MONTHS[dt.getMonth() + 1]} ${dt.getDate()}, ${dt.getFullYear()}`
  const screenHeight = Dimensions.get('window').height

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={onClose} activeOpacity={1} />
        <View style={{ backgroundColor: C.surface, borderRadius: 20, padding: 24, paddingBottom: 32, maxHeight: screenHeight * 0.85 }}>
          <View style={{ width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
          <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: 20, right: 20 }}>
            <X size={22} color={C.textMuted} />
          </TouchableOpacity>

          <Text style={{ ...T.headlineMedium, marginBottom: 4 }}>{a.doctorName}</Text>
          <Text style={{ ...T.bodyMedium, marginBottom: 16 }}>{a.specialty}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Calendar size={16} color={C.textMuted} />
            <Text style={{ ...T.bodyMedium }}>{dateStr} at {formatTime(dt)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <MapPin size={16} color={C.textMuted} />
            <Text style={{ ...T.bodyMedium }}>{a.location}</Text>
          </View>
          {a.notes ? (
            <>
              <Text style={{ ...T.labelLarge, marginBottom: 4 }}>Notes</Text>
              <Text style={{ ...T.bodyMedium, marginBottom: 16 }}>{a.notes}</Text>
            </>
          ) : null}

          {a.status === 'upcoming' && (
            <>
              <TouchableOpacity style={{ width: '100%', paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
                <Edit2 size={16} color={C.textPrimary} />
                <Text style={{ color: C.textPrimary, fontWeight: '600', fontSize: 15 }}>Reschedule</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onCancel}
                style={{ width: '100%', paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: C.red, backgroundColor: C.redBg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <X size={16} color={C.red} />
                <Text style={{ color: C.red, fontWeight: '600', fontSize: 15 }}>Cancel Appointment</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}
