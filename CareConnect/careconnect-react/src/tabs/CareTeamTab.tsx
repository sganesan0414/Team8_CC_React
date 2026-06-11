import { useState } from 'react'
import { Phone, Mail, Shield, Plus, Trash2, AlertTriangle, Users } from 'lucide-react'
import { useCareTeamStore } from '../store/careTeamStore'
import StatCard from '../components/StatCard'
import AlertBanner from '../components/AlertBanner'
import type { CareTeamMember } from '../types'
import { C, T, inputBase } from '../theme/styles'

interface Props { onNavChange: (i: number) => void }

export default function CareTeamTab({ onNavChange: _ }: Props) {
  const { members, addMember, removeMember } = useCareTeamStore()
  const emergencyContactCount = members.filter(m => m.isEmergencyContact).length
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [isEmergency, setIsEmergency] = useState(false)

  const handleAdd = () => {
    if (!name || !role) return
    addMember({ name, role, phone, email, isEmergencyContact: isEmergency })
    setShowForm(false)
    setName(''); setRole(''); setPhone(''); setEmail(''); setIsEmergency(false)
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <StatCard icon={Users}  iconColor={C.primary} value={String(members.length)} label="Total Members" />
        <StatCard icon={Shield} iconColor={C.red}     value={String(emergencyContactCount)} label="Emergency Contacts" />
      </div>

      {emergencyContactCount === 0 && (
        <div style={{ marginBottom: 16 }}>
          <AlertBanner
            icon={AlertTriangle}
            title="No Emergency Contact"
            body="Please add an emergency contact to ensure you can be reached in critical situations."
            actionLabel="Add Emergency Contact"
            onAction={() => setShowForm(true)}
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ ...T.headlineMedium }}>Care Team Members</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: C.primary, border: 'none', color: 'white', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600 }}
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <h3 style={{ ...T.titleLarge, marginBottom: 12 }}>New Team Member</h3>
          {[
            { label: 'Full Name *', value: name,  setter: setName,  type: 'text',  placeholder: 'Dr. Jane Smith' },
            { label: 'Role *',      value: role,  setter: setRole,  type: 'text',  placeholder: 'Cardiologist' },
            { label: 'Phone',       value: phone, setter: setPhone, type: 'tel',   placeholder: '(555) 000-0000' },
            { label: 'Email',       value: email, setter: setEmail, type: 'email', placeholder: 'doctor@hospital.com' },
          ].map(f => (
            <label key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
              <span style={{ ...T.labelMedium }}>{f.label}</span>
              <input type={f.type} value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} style={{ ...inputBase }} />
            </label>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={isEmergency} onChange={e => setIsEmergency(e.target.checked)} style={{ width: 18, height: 18 }} />
            <span style={{ ...T.bodyMedium }}>Set as Emergency Contact</span>
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleAdd} disabled={!name || !role} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: C.primary, color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: (!name || !role) ? 0.5 : 1 }}>Add Member</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          </div>
        </div>
      )}

      {members.map(member => (
        <MemberCard key={member.id} member={member} onRemove={() => removeMember(member.id)} />
      ))}
    </div>
  )
}

function MemberCard({ member, onRemove }: { member: CareTeamMember; onRemove: () => void }) {
  const initials = member.name.split(' ').map(w => w[0]).slice(0, 2).join('')

  return (
    <div
      aria-label={`${member.name}, ${member.role}${member.isEmergencyContact ? ', Emergency Contact' : ''}`}
      style={{
        background: C.surface,
        border: `1.5px solid ${member.isEmergencyContact ? C.red + '66' : C.border}`,
        borderRadius: 16, padding: 16, marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.primary + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ ...T.titleLarge, color: C.primary }}>{initials}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ ...T.labelLarge }}>{member.name}</span>
            {member.isEmergencyContact && (
              <span style={{ background: C.red + '18', border: `1px solid ${C.red}`, color: C.red, borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                Emergency
              </span>
            )}
          </div>
          <span style={{ ...T.bodyMedium }}>{member.role}</span>
        </div>
        <button onClick={onRemove} title="Remove member" style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: 6 }}>
          <Trash2 size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {member.phone && (
          <div style={{ flex: 1, background: C.surfaceVariant, borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
            <Phone size={14} color={C.textMuted} />
            <span style={{ ...T.caption, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.phone}</span>
          </div>
        )}
        {member.email && (
          <div style={{ flex: 1, background: C.surfaceVariant, borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
            <Mail size={14} color={C.textMuted} />
            <span style={{ ...T.caption, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.email}</span>
          </div>
        )}
      </div>

      <button style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: `1.5px solid ${C.border}`, background: 'transparent', cursor: 'pointer', color: C.textSecondary, fontWeight: 600, fontSize: 15 }}>
        Manage Access
      </button>
    </div>
  )
}
