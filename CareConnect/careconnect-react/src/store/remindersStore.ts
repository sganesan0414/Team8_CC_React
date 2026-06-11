import { create } from 'zustand'
import type { Reminder } from '../types'

interface RemindersState {
  reminders: Reminder[]
  addReminder: (reminder: Omit<Reminder, 'id'>) => void
  removeReminder: (id: string) => void
  toggleReminder: (id: string) => void
  updateReminder: (id: string, updates: Partial<Reminder>) => void
}

const mockReminders: Reminder[] = [
  { id: 'r1', title: 'Morning Medications', description: 'Take morning medications with water', time: '8:00 AM', frequency: 'daily', enabled: true },
  { id: 'r2', title: 'Blood Pressure Check', description: 'Measure blood pressure before breakfast', time: '7:30 AM', frequency: 'daily', enabled: true },
  { id: 'r3', title: 'Evening Medications', description: 'Take evening medications after dinner', time: '8:00 PM', frequency: 'daily', enabled: true },
  { id: 'r4', title: 'Weekly Weight Check', description: 'Record your weight every Monday morning', time: '9:00 AM', frequency: 'weekly', enabled: false },
]

export const useRemindersStore = create<RemindersState>((set) => ({
  reminders: mockReminders,

  addReminder: (reminder) => set(s => ({
    reminders: [...s.reminders, { ...reminder, id: `r${Date.now()}` }],
  })),

  removeReminder: (id) => set(s => ({
    reminders: s.reminders.filter(r => r.id !== id),
  })),

  toggleReminder: (id) => set(s => ({
    reminders: s.reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r),
  })),

  updateReminder: (id, updates) => set(s => ({
    reminders: s.reminders.map(r => r.id === id ? { ...r, ...updates } : r),
  })),
}))
