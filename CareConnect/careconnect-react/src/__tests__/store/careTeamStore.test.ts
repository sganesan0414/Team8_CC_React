import { useCareTeamStore } from '../../store/careTeamStore'

// Initial mock data:
// ct1: Dr. Sarah Johnson  — Primary Care Physician,  isEmergencyContact: true
// ct2: Patricia Williams  — Registered Nurse,        isEmergencyContact: false
// ct3: Dr. Michael Chen   — Cardiologist,            isEmergencyContact: false

const initialState = useCareTeamStore.getState()

beforeEach(() => {
  useCareTeamStore.setState(initialState, true)
})

describe('careTeamStore', () => {
  describe('initial state', () => {
    it('loads 3 mock care team members', () => {
      expect(useCareTeamStore.getState().members).toHaveLength(3)
    })

    it('has exactly one emergency contact', () => {
      const emergency = useCareTeamStore.getState().members.filter(m => m.isEmergencyContact)
      expect(emergency).toHaveLength(1)
    })

    it('has two non-emergency contacts', () => {
      const nonEmergency = useCareTeamStore.getState().members.filter(m => !m.isEmergencyContact)
      expect(nonEmergency).toHaveLength(2)
    })

    it('each member has required fields', () => {
      for (const member of useCareTeamStore.getState().members) {
        expect(member.id).toBeDefined()
        expect(member.name).toBeDefined()
        expect(member.role).toBeDefined()
        expect(member.phone).toBeDefined()
        expect(member.email).toBeDefined()
        expect(typeof member.isEmergencyContact).toBe('boolean')
      }
    })
  })

  describe('addMember', () => {
    const newMember = {
      name: 'Dr. Karen Lee',
      role: 'Neurologist',
      phone: '(555) 999-0000',
      email: 'klee@neuro.com',
      isEmergencyContact: false,
    }

    it('increases the member count by one', () => {
      useCareTeamStore.getState().addMember(newMember)
      expect(useCareTeamStore.getState().members).toHaveLength(4)
    })

    it('assigns an id prefixed with "ct"', () => {
      useCareTeamStore.getState().addMember(newMember)
      const added = useCareTeamStore.getState().members.at(-1)!
      expect(added.id).toMatch(/^ct/)
    })

    it('preserves all provided member fields', () => {
      useCareTeamStore.getState().addMember(newMember)
      const added = useCareTeamStore.getState().members.at(-1)!
      expect(added.name).toBe('Dr. Karen Lee')
      expect(added.role).toBe('Neurologist')
      expect(added.phone).toBe('(555) 999-0000')
      expect(added.email).toBe('klee@neuro.com')
      expect(added.isEmergencyContact).toBe(false)
    })

    it('can add a member designated as an emergency contact', () => {
      useCareTeamStore.getState().addMember({ ...newMember, isEmergencyContact: true })
      const added = useCareTeamStore.getState().members.at(-1)!
      expect(added.isEmergencyContact).toBe(true)
    })

    it('can add multiple members independently', () => {
      useCareTeamStore.getState().addMember(newMember)
      useCareTeamStore.getState().addMember({ ...newMember, name: 'Dr. Sam Brown' })
      expect(useCareTeamStore.getState().members).toHaveLength(5)
    })
  })

  describe('removeMember', () => {
    it('removes the specified member by id', () => {
      useCareTeamStore.getState().removeMember('ct1')
      expect(useCareTeamStore.getState().members.find(m => m.id === 'ct1')).toBeUndefined()
    })

    it('decreases the member count by one', () => {
      useCareTeamStore.getState().removeMember('ct1')
      expect(useCareTeamStore.getState().members).toHaveLength(2)
    })

    it('does not remove other members', () => {
      useCareTeamStore.getState().removeMember('ct1')
      expect(useCareTeamStore.getState().members.find(m => m.id === 'ct2')).toBeDefined()
      expect(useCareTeamStore.getState().members.find(m => m.id === 'ct3')).toBeDefined()
    })

    it('is a no-op for a non-existent id', () => {
      useCareTeamStore.getState().removeMember('nonexistent')
      expect(useCareTeamStore.getState().members).toHaveLength(3)
    })

    it('can remove all members one by one', () => {
      for (const id of ['ct1', 'ct2', 'ct3']) {
        useCareTeamStore.getState().removeMember(id)
      }
      expect(useCareTeamStore.getState().members).toHaveLength(0)
    })
  })

  describe('updateMember', () => {
    it('updates the name of a member', () => {
      useCareTeamStore.getState().updateMember('ct1', { name: 'Dr. Sarah J. Johnson' })
      expect(useCareTeamStore.getState().members.find(m => m.id === 'ct1')?.name).toBe('Dr. Sarah J. Johnson')
    })

    it('updates the role of a member', () => {
      useCareTeamStore.getState().updateMember('ct2', { role: 'Nurse Practitioner' })
      expect(useCareTeamStore.getState().members.find(m => m.id === 'ct2')?.role).toBe('Nurse Practitioner')
    })

    it('updates the phone number of a member', () => {
      useCareTeamStore.getState().updateMember('ct1', { phone: '(555) 000-1111' })
      expect(useCareTeamStore.getState().members.find(m => m.id === 'ct1')?.phone).toBe('(555) 000-1111')
    })

    it('updates the email of a member', () => {
      useCareTeamStore.getState().updateMember('ct1', { email: 'new@email.com' })
      expect(useCareTeamStore.getState().members.find(m => m.id === 'ct1')?.email).toBe('new@email.com')
    })

    it('can promote a member to emergency contact', () => {
      useCareTeamStore.getState().updateMember('ct2', { isEmergencyContact: true })
      expect(useCareTeamStore.getState().members.find(m => m.id === 'ct2')?.isEmergencyContact).toBe(true)
    })

    it('can demote a member from emergency contact', () => {
      useCareTeamStore.getState().updateMember('ct1', { isEmergencyContact: false })
      expect(useCareTeamStore.getState().members.find(m => m.id === 'ct1')?.isEmergencyContact).toBe(false)
    })

    it('can update multiple fields at once', () => {
      useCareTeamStore.getState().updateMember('ct2', { name: 'Pat Williams', role: 'Head Nurse' })
      const updated = useCareTeamStore.getState().members.find(m => m.id === 'ct2')!
      expect(updated.name).toBe('Pat Williams')
      expect(updated.role).toBe('Head Nurse')
    })

    it('does not overwrite unspecified fields', () => {
      const original = useCareTeamStore.getState().members.find(m => m.id === 'ct1')!
      useCareTeamStore.getState().updateMember('ct1', { name: 'New Name' })
      const updated = useCareTeamStore.getState().members.find(m => m.id === 'ct1')!
      expect(updated.role).toBe(original.role)
      expect(updated.phone).toBe(original.phone)
      expect(updated.email).toBe(original.email)
      expect(updated.isEmergencyContact).toBe(original.isEmergencyContact)
    })

    it('does not affect other members', () => {
      const original = useCareTeamStore.getState().members.find(m => m.id === 'ct2')!
      useCareTeamStore.getState().updateMember('ct1', { name: 'Changed' })
      const unchanged = useCareTeamStore.getState().members.find(m => m.id === 'ct2')!
      expect(unchanged.name).toBe(original.name)
    })
  })
})
