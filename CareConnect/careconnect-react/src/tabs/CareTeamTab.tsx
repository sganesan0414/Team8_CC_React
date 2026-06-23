import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Phone, Mail, Shield, Plus, Trash2, AlertTriangle, Users } from 'lucide-react-native'
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
    <View style={{ padding: 20 }}>
      {/* Stats */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <View style={{ flex: 1 }}><StatCard icon={Users}  iconColor={C.primary} value={String(members.length)} label="Total Members" /></View>
        <View style={{ flex: 1 }}><StatCard icon={Shield} iconColor={C.red}     value={String(emergencyContactCount)} label="Emergency Contacts" /></View>
      </View>

      {emergencyContactCount === 0 && (
        <View style={{ marginBottom: 16 }}>
          <AlertBanner
            icon={AlertTriangle}
            title="No Emergency Contact"
            body="Please add an emergency contact to ensure you can be reached in critical situations."
            actionLabel="Add Emergency Contact"
            onAction={() => setShowForm(true)}
          />
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text accessible={true} accessibilityRole="header" style={{ ...T.headlineMedium }}>Care Team Members</Text>
        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Add team member"
          accessibilityHint="Tap to open the new team member form"
          accessibilityState={{ expanded: showForm }}
          onPress={() => setShowForm(!showForm)}
          style={{ backgroundColor: C.primary, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}
        >
          <Plus size={16} color="white" />
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Add</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <Text accessible={true} accessibilityRole="header" style={{ ...T.titleLarge, marginBottom: 12 }}>New Team Member</Text>
          {[
            { label: 'Full Name *', value: name,  setter: setName,  keyboard: 'default' as const, placeholder: 'Dr. Jane Smith' },
            { label: 'Role *',      value: role,  setter: setRole,  keyboard: 'default' as const, placeholder: 'Cardiologist' },
            { label: 'Phone',       value: phone, setter: setPhone, keyboard: 'phone-pad' as const, placeholder: '(555) 000-0000' },
            { label: 'Email',       value: email, setter: setEmail, keyboard: 'email-address' as const, placeholder: 'doctor@hospital.com' },
          ].map(f => (
            <View key={f.label} style={{ gap: 4, marginBottom: 10 }}>
              <Text style={{ ...T.labelMedium }}>{f.label}</Text>
              <TextInput
                accessible={true}
                accessibilityLabel={f.label.replace(' *', '')}
                accessibilityHint={`Enter ${f.label.replace(' *', '').toLowerCase()}`}
                value={f.value}
                onChangeText={f.setter}
                placeholder={f.placeholder}
                keyboardType={f.keyboard}
                style={{ ...inputBase }}
              />
            </View>
          ))}

          {/* Emergency contact toggle */}
          <TouchableOpacity
            accessible={true}
            accessibilityRole="checkbox"
            accessibilityLabel="Set as emergency contact"
            accessibilityState={{ checked: isEmergency }}
            onPress={() => setIsEmergency(!isEmergency)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}
          >
            <View style={{
              width: 22, height: 22,
              borderWidth: 2, borderColor: isEmergency ? C.primary : C.border,
              borderRadius: 4,
              backgroundColor: isEmergency ? C.primary : 'transparent',
              alignItems: 'center', justifyContent: 'center',
            }}>
              {isEmergency && <Text style={{ color: 'white', fontSize: 13, fontWeight: '700' }}>✓</Text>}
            </View>
            <Text style={{ ...T.bodyMedium }}>Set as Emergency Contact</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Add member"
              accessibilityHint="Tap to save the new team member"
              accessibilityState={{ disabled: !name || !role }}
              onPress={handleAdd}
              disabled={!name || !role}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', opacity: (!name || !role) ? 0.5 : 1 }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Add Member</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              accessibilityHint="Tap to close the new team member form"
              onPress={() => setShowForm(false)}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, backgroundColor: 'transparent', alignItems: 'center' }}
            >
              <Text style={{ fontWeight: '600', color: C.textPrimary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {members.map(member => (
        <MemberCard key={member.id} member={member} onRemove={() => removeMember(member.id)} />
      ))}
    </View>
  )
}

function MemberCard({ member, onRemove }: { member: CareTeamMember; onRemove: () => void }) {
  const initials = member.name.split(' ').map(w => w[0]).slice(0, 2).join('')

  return (
    <View style={{ backgroundColor: C.surface, borderWidth: 1.5, borderColor: member.isEmergencyContact ? C.red + '66' : C.border, borderRadius: 16, padding: 16, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <View accessible={false} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.primary + '18', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Text style={{ ...T.titleLarge, color: C.primary }}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <Text style={{ ...T.labelLarge }}>{member.name}</Text>
            {member.isEmergencyContact && (
              <View style={{ backgroundColor: C.red + '18', borderWidth: 1, borderColor: C.red, borderRadius: 20, paddingVertical: 2, paddingHorizontal: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: C.red }}>Emergency</Text>
              </View>
            )}
          </View>
          <Text style={{ ...T.bodyMedium }}>{member.role}</Text>
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${member.name}`}
          accessibilityHint="Tap to remove this care team member"
          onPress={onRemove}
          style={{ padding: 6 }}
        >
          <Trash2 size={18} color={C.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        {member.phone.length > 0 && (
          <View
            accessible={true}
            accessibilityLabel={`Phone: ${member.phone}`}
            style={{ flex: 1, backgroundColor: C.surfaceVariant, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 6, overflow: 'hidden' }}
          >
            <Phone size={14} color={C.textMuted} />
            <Text numberOfLines={1} style={{ ...T.caption }}>{member.phone}</Text>
          </View>
        )}
        {member.email.length > 0 && (
          <View
            accessible={true}
            accessibilityLabel={`Email: ${member.email}`}
            style={{ flex: 1, backgroundColor: C.surfaceVariant, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 6, overflow: 'hidden' }}
          >
            <Mail size={14} color={C.textMuted} />
            <Text numberOfLines={1} style={{ ...T.caption }}>{member.email}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Manage access for ${member.name}`}
        accessibilityHint="Tap to manage this care team member's access"
        style={{ width: '100%', paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: 'transparent', alignItems: 'center' }}
      >
        <Text style={{ color: C.textSecondary, fontWeight: '600', fontSize: 15 }}>Manage Access</Text>
      </TouchableOpacity>
    </View>
  )
}
