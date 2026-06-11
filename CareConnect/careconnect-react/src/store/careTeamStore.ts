import { create } from 'zustand'
import type { CareTeamMember } from '../types'

interface CareTeamState {
  members: CareTeamMember[]
  addMember: (member: Omit<CareTeamMember, 'id'>) => void
  removeMember: (id: string) => void
  updateMember: (id: string, updates: Partial<CareTeamMember>) => void
}

const mockMembers: CareTeamMember[] = [
  {
    id: 'ct1',
    name: 'Dr. Sarah Johnson',
    role: 'Primary Care Physician',
    phone: '(555) 123-4567',
    email: 'sjohnson@citymedical.com',
    isEmergencyContact: true,
  },
  {
    id: 'ct2',
    name: 'Patricia Williams',
    role: 'Registered Nurse',
    phone: '(555) 234-5678',
    email: 'pwilliams@citymedical.com',
    isEmergencyContact: false,
  },
  {
    id: 'ct3',
    name: 'Dr. Michael Chen',
    role: 'Cardiologist',
    phone: '(555) 345-6789',
    email: 'mchen@heartinstitute.com',
    isEmergencyContact: false,
  },
]

export const useCareTeamStore = create<CareTeamState>((set) => ({
  members: mockMembers,

  addMember: (member) => set(s => ({
    members: [...s.members, { ...member, id: `ct${Date.now()}` }],
  })),

  removeMember: (id) => set(s => ({
    members: s.members.filter(m => m.id !== id),
  })),

  updateMember: (id, updates) => set(s => ({
    members: s.members.map(m => m.id === id ? { ...m, ...updates } : m),
  })),
}))
