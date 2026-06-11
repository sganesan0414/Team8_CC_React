import { useNavigate } from 'react-router-dom'
import { ShoppingBag, RefreshCw, MapPin, Phone, Clock, CheckCircle } from 'lucide-react'
import AppBar from '../components/AppBar'
import ContextBar from '../components/ContextBar'
import { C, T } from '../theme/styles'

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
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: C.background }}>
      <AppBar title="Pharmacy" onBack={() => navigate(-1)} backLabel="Home" />
      <ContextBar label="Home › Pharmacy" />

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

        {/* Pharmacy Info */}
        <div style={{ background: C.primary, borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <ShoppingBag size={24} color="white" />
            <span style={{ ...T.titleLarge, color: 'white' }}>{pharmacy.name}</span>
          </div>
          {[
            { icon: MapPin, text: pharmacy.address },
            { icon: Phone, text: pharmacy.phone },
            { icon: Clock, text: pharmacy.hours },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Icon size={15} color="rgba(255,255,255,0.75)" />
              <span style={{ ...T.bodyMedium, color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Refills */}
        <h2 style={{ ...T.headlineMedium, marginBottom: 12 }}>Prescription Refills</h2>

        {mockRefills.map(rx => {
          const isUrgent = rx.status === 'urgent'
          const isDueSoon = rx.status === 'due-soon'
          const borderColor = isUrgent ? C.red : isDueSoon ? C.warning : C.border
          const bgColor = isUrgent ? C.redBg : isDueSoon ? C.warningBg : C.surface

          return (
            <div key={rx.id} style={{ background: bgColor, border: `1.5px solid ${borderColor}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <p style={{ ...T.labelLarge }}>{rx.name}</p>
                  <p style={{ ...T.caption, marginTop: 2 }}>Due: {rx.dueDate}</p>
                </div>
                <span style={{
                  background: isUrgent ? C.red + '18' : isDueSoon ? C.warning + '18' : C.success + '18',
                  border: `1px solid ${isUrgent ? C.red : isDueSoon ? C.warning : C.success}`,
                  color: isUrgent ? C.red : isDueSoon ? C.warning : C.success,
                  borderRadius: 20, padding: '3px 8px', fontSize: 12, fontWeight: 700,
                }}>
                  {isUrgent ? 'No refills' : isDueSoon ? `${rx.refillsLeft} left` : `${rx.refillsLeft} left`}
                </span>
              </div>
              <button style={{
                width: '100%', padding: '12px 0', borderRadius: 12,
                background: isUrgent ? C.red : C.primary,
                color: 'white', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontWeight: 600, fontSize: 15,
              }}>
                <RefreshCw size={16} />
                {isUrgent ? 'Request Emergency Refill' : 'Request Refill'}
              </button>
            </div>
          )
        })}

        {/* Order History */}
        <h2 style={{ ...T.headlineMedium, marginBottom: 12, marginTop: 8 }}>Recent Orders</h2>
        {['Metformin 500 mg — Picked up Jun 1', 'Lisinopril 10 mg — Picked up May 18'].map(item => (
          <div key={item} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle size={18} color={C.success} />
            <span style={{ ...T.bodyMedium }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
