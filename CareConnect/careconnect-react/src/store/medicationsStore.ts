import { create } from 'zustand'
import type { Medication } from '../types'

interface MedicationsState {
  medications: Medication[]
  searchQuery: string
  markTaken: (id: string) => void
  undoTaken: (id: string) => void
  setSearchQuery: (query: string) => void
  addMedication: (med: Omit<Medication, 'id'>) => void
  removeMedication: (id: string) => void
}

const mockMeds: Medication[] = [
  { id: '1', name: 'Lisinopril',    dose: '10 mg',  schedule: 'Daily',       times: ['8:00 AM'],               taken: false },
  { id: '2', name: 'Metformin',     dose: '500 mg', schedule: 'Twice daily', times: ['8:00 AM', '8:00 PM'],    taken: true  },
  { id: '3', name: 'Atorvastatin',  dose: '20 mg',  schedule: 'Daily',       times: ['9:00 PM'],               taken: false },
  { id: '4', name: 'Aspirin',       dose: '81 mg',  schedule: 'Daily',       times: ['8:00 AM'],               taken: false },
  { id: '5', name: 'Levothyroxine', dose: '75 mcg', schedule: 'Daily',       times: ['7:00 AM'],               taken: true  },
  { id: '6', name: 'Omeprazole',    dose: '20 mg',  schedule: 'Daily',       times: ['7:30 AM'],               taken: false },
]

export const useMedicationsStore = create<MedicationsState>((set) => ({
  medications: mockMeds,
  searchQuery: '',

  markTaken: (id) => set(s => ({
    medications: s.medications.map(m => m.id === id ? { ...m, taken: true } : m),
  })),

  undoTaken: (id) => set(s => ({
    medications: s.medications.map(m => m.id === id ? { ...m, taken: false } : m),
  })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  addMedication: (med) => set(s => ({
    medications: [...s.medications, { ...med, id: String(Date.now()) }],
  })),

  removeMedication: (id) => set(s => ({
    medications: s.medications.filter(m => m.id !== id),
  })),
}))
