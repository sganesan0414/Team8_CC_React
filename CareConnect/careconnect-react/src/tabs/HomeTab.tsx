import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Pill, Calendar, Heart, FileText, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react-native'
import { useAccountStore } from '../store/accountStore'
import { useMedicationsStore } from '../store/medicationsStore'
import { useAppointmentsStore } from '../store/appointmentsStore'
import AlertBanner from '../components/AlertBanner'
import { C, T } from '../theme/styles'
import type { RootStackParamList } from '../App'

type Nav = NativeStackNavigationProp<RootStackParamList>

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
  const navigation = useNavigation<Nav>()
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
    { icon: Pill,        label: 'My\nMedications', color: C.primary,  onPress: () => onNavChange(1) },
    { icon: Calendar,   label: 'Appointments',    color: C.purple,   onPress: () => onNavChange(2) },
    { icon: Heart,      label: 'Health\nMetrics', color: '#B0193C',  onPress: () => navigation.navigate('HealthMetrics') },
    { icon: FileText,   label: 'Reports',         color: C.success,  onPress: () => navigation.navigate('HealthReports') },
    { icon: ShoppingBag,label: 'Pharmacy',        color: '#816FC9',  onPress: () => navigation.navigate('Pharmacy') },
  ]

  return (
    <View style={{ padding: 20 }}>
      {/* Hero banner */}
      <View style={{ backgroundColor: C.primary, borderRadius: 20, padding: 24, marginBottom: 24 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={{ marginBottom: 4 }}
        >
          <Text style={{ ...T.displayLarge, color: 'white' }}>Good Morning, {name}</Text>
        </TouchableOpacity>
        <Text style={{ ...T.bodyMedium, color: 'rgba(255,255,255,0.75)', marginBottom: 20 }}>{todayLabel}</Text>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[
            { icon: Pill,       value: `${takenCount}/${medications.length}`, label: 'Medications\nToday',    color: C.accent },
            { icon: TrendingUp, value: '94%',                                  label: 'Adherence\nRate',       color: C.success },
            { icon: Calendar,   value: nextAppt ? `${SHORT_MONTHS[nextAppt.dateTime.getMonth()]} ${nextAppt.dateTime.getDate()}` : 'None', label: 'Next\nAppointment', color: C.accent },
          ].map(({ icon: Icon, value, label, color }) => (
            <View key={label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 12 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <Icon size={14} color="white" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: 'white', marginBottom: 2 }}>{value}</Text>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 15 }}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={{ ...T.headlineMedium, marginBottom: 14 }}>Quick Actions</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {quickActions.map(({ icon: Icon, label, color, onPress }) => (
          <TouchableOpacity
            key={label}
            onPress={onPress}
            style={{
              backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
              borderRadius: 16, padding: 20, paddingHorizontal: 16,
              width: '48%', gap: 10, minHeight: 90,
            }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: color + '18', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={22} color={color} />
            </View>
            <Text style={{ ...T.labelLarge }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alert */}
      <AlertBanner
        icon={AlertTriangle}
        title="Refill Reminder"
        body="Atorvastatin has only 2 refills remaining. Request a refill soon."
        actionLabel="Request Refill"
        onAction={() => navigation.navigate('Pharmacy')}
      />

      {/* Upcoming Medications */}
      <View style={{ marginTop: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ ...T.headlineMedium }}>Upcoming Medications</Text>
          <TouchableOpacity onPress={() => onNavChange(1)}>
            <Text style={{ color: C.primary, fontWeight: '600', fontSize: 14 }}>View All</Text>
          </TouchableOpacity>
        </View>

        {unTakenMeds.length === 0
          ? <Text style={{ ...T.bodyMedium }}>All medications taken for today!</Text>
          : unTakenMeds.map(med => (
            <View key={med.id} style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.warningBg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Pill size={18} color={C.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...T.labelLarge }}>{med.name}</Text>
                <Text style={{ ...T.bodyMedium }}>{med.dose}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ ...T.titleLarge, color: C.warning, fontSize: 16 }}>{med.times[0]}</Text>
                <Text style={{ ...T.caption, color: C.warning }}>Due soon</Text>
              </View>
            </View>
          ))
        }
      </View>

      {/* Next Appointment */}
      <View style={{ marginTop: 24, marginBottom: 32 }}>
        <Text style={{ ...T.headlineMedium, marginBottom: 12 }}>Next Appointment</Text>
        {nextAppt ? (
          <View style={{ backgroundColor: C.infoBg, borderWidth: 1.5, borderColor: C.primary + '30', borderRadius: 16, padding: 18 }}>
            <Text style={{ ...T.titleLarge, marginBottom: 2 }}>{nextAppt.doctorName}</Text>
            <Text style={{ ...T.bodyMedium, marginBottom: 12 }}>{nextAppt.specialty}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Calendar size={14} color={C.textMuted} />
              <Text style={{ ...T.bodyMedium }}>{MONTHS[nextAppt.dateTime.getMonth()]} {nextAppt.dateTime.getDate()}, {nextAppt.dateTime.getFullYear()}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <Pill size={14} color={C.textMuted} />
              <Text style={{ ...T.bodyMedium }}>{formatTime(nextAppt.dateTime)}</Text>
            </View>
            <TouchableOpacity
              onPress={() => onNavChange(2)}
              style={{ width: '100%', paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: 'transparent', alignItems: 'center' }}
            >
              <Text style={{ color: C.textPrimary, fontWeight: '600', fontSize: 15 }}>View All Appointments</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 18, alignItems: 'center' }}>
            <Text style={{ ...T.bodyMedium }}>No upcoming appointments.</Text>
          </View>
        )}
      </View>
    </View>
  )
}
