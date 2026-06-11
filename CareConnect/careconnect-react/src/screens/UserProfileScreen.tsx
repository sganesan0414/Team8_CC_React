import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react'
import { useAccountStore } from '../store/accountStore'
import AppBar from '../components/AppBar'
import ContextBar from '../components/ContextBar'
import { C, T, inputBase, btnPrimary } from '../theme/styles'

export default function UserProfileScreen() {
  const navigate = useNavigate()
  const { displayName, email, avatarInitials, updateProfile } = useAccountStore()

  const [name, setName] = useState(displayName)
  const [phone, setPhone] = useState('(555) 000-0000')
  const [address, setAddress] = useState('123 Main St, Anytown, USA')
  const [dob, setDob] = useState('1980-01-01')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateProfile(name)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: C.background }}>
      <AppBar title="My Profile" onBack={() => navigate(-1)} />
      <ContextBar label="Settings › My Profile" />

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 700, color: 'white',
            }}>
              {avatarInitials || <User size={40} color="white" />}
            </div>
            <button style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 28, height: 28, borderRadius: '50%',
              background: C.accent, border: '2px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Camera size={14} color="white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, marginBottom: 20 }}>
          <h2 style={{ ...T.titleLarge, marginBottom: 16 }}>Personal Information</h2>

          {[
            { icon: User,   label: 'Full Name',      value: name,    setter: setName,    type: 'text'  },
            { icon: Mail,   label: 'Email',          value: email,   setter: () => {},   type: 'email', disabled: true },
            { icon: Phone,  label: 'Phone',          value: phone,   setter: setPhone,   type: 'tel'   },
            { icon: MapPin, label: 'Address',        value: address, setter: setAddress, type: 'text'  },
          ].map(({ icon: Icon, label, value, setter, type, disabled }) => (
            <label key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              <span style={{ ...T.labelMedium }}>{label}</span>
              <div style={{ position: 'relative' }}>
                <Icon size={18} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={type}
                  value={value}
                  onChange={e => (setter as (v: string) => void)(e.target.value)}
                  disabled={disabled}
                  style={{ ...inputBase, paddingLeft: 44, opacity: disabled ? 0.6 : 1 }}
                />
              </div>
            </label>
          ))}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 4 }}>
            <span style={{ ...T.labelMedium }}>Date of Birth</span>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={{ ...inputBase }} />
          </label>
        </div>

        <button
          onClick={handleSave}
          style={{ ...btnPrimary, background: saved ? C.success : C.primary }}
        >
          <Save size={18} />
          <span>{saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  )
}
