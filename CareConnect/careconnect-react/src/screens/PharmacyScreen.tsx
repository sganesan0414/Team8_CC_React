import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ShoppingBag, RefreshCw, MapPin, Phone, Clock, CheckCircle } from 'lucide-react-native'
import AppBar from '../components/AppBar'
import ContextBar from '../components/ContextBar'
import { C, T } from '../theme/styles'
import type { RootStackParamList } from '../App'

type Nav = NativeStackNavigationProp<RootStackParamList>

const mockRefills = [
  { id: '1', name: 'Atorvastatin 20 mg', refillsLeft: 2, dueDate: 'Jun 20, 2026', status: 'due-soon' },
  { id: '2', name: 'Lisinopril 10 mg',   refillsLeft: 5, dueDate: 'Jul 15, 2026', status: 'ok' },
  { id: '3', name: 'Metformin 500 mg',   refillsLeft: 0, dueDate: 'Jun 12, 2026', status: 'urgent' },
]

const pharmacy = {
  name: 'CareConnect Pharmacy',
  address: '123 Health St, Suite 100',
  phone: '(555) 800-CARE',
  hours: 'Mon–Fri 8 AM – 8 PM, Sat 9 AM – 5 PM',
}

export default function PharmacyScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <AppBar title="Pharmacy" onBack={() => navigation.goBack()} backLabel="Home" />
      <ContextBar label="Home › Pharmacy" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>

        {/* Pharmacy Info */}
        <View style={{ backgroundColor: C.primary, borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <ShoppingBag size={24} color="white" />
            <Text style={{ ...T.titleLarge, color: 'white' }}>{pharmacy.name}</Text>
          </View>
          {[
            { icon: MapPin, text: pharmacy.address },
            { icon: Phone, text: pharmacy.phone },
            { icon: Clock, text: pharmacy.hours },
          ].map(({ icon: Icon, text }) => (
            <View key={text} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Icon size={15} color="rgba(255,255,255,0.75)" />
              <Text style={{ ...T.bodyMedium, color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{text}</Text>
            </View>
          ))}
        </View>

        <Text style={{ ...T.headlineMedium, marginBottom: 12 }}>Prescription Refills</Text>

        {mockRefills.map(rx => {
          const isUrgent = rx.status === 'urgent'
          const isDueSoon = rx.status === 'due-soon'
          const borderColor = isUrgent ? C.red : isDueSoon ? C.warning : C.border
          const bgColor = isUrgent ? C.redBg : isDueSoon ? C.warningBg : C.surface

          return (
            <View key={rx.id} style={{ backgroundColor: bgColor, borderWidth: 1.5, borderColor, borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View>
                  <Text style={{ ...T.labelLarge }}>{rx.name}</Text>
                  <Text style={{ ...T.caption, marginTop: 2 }}>Due: {rx.dueDate}</Text>
                </View>
                <View style={{
                  backgroundColor: isUrgent ? C.red + '18' : isDueSoon ? C.warning + '18' : C.success + '18',
                  borderWidth: 1,
                  borderColor: isUrgent ? C.red : isDueSoon ? C.warning : C.success,
                  borderRadius: 20, paddingVertical: 3, paddingHorizontal: 8,
                }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: isUrgent ? C.red : isDueSoon ? C.warning : C.success }}>
                    {isUrgent ? 'No refills' : `${rx.refillsLeft} left`}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={{
                width: '100%', paddingVertical: 12, borderRadius: 12,
                backgroundColor: isUrgent ? C.red : C.primary,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <RefreshCw size={16} color="white" />
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>
                  {isUrgent ? 'Request Emergency Refill' : 'Request Refill'}
                </Text>
              </TouchableOpacity>
            </View>
          )
        })}

        <Text style={{ ...T.headlineMedium, marginBottom: 12, marginTop: 8 }}>Recent Orders</Text>
        {['Metformin 500 mg — Picked up Jun 1', 'Lisinopril 10 mg — Picked up May 18'].map(item => (
          <View key={item} style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <CheckCircle size={18} color={C.success} />
            <Text style={{ ...T.bodyMedium }}>{item}</Text>
          </View>
        ))}

      </ScrollView>
    </View>
  )
}
