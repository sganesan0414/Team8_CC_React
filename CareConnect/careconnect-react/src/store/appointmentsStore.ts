import { create } from 'zustand'
import type { Appointment, AppointmentStatus } from '../types'

interface AppointmentsState {
  appointments: Appointment[]
  addAppointment: (appt: Omit<Appointment, 'id'>) => void
  cancelAppointment: (id: string) => void
  rescheduleAppointment: (id: string, newDateTime: Date) => void
  completeAppointment: (id: string) => void
}

const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Primary Care',
    dateTime: new Date(2026, 5, 15, 10, 0),
    location: 'City Medical Center, Room 204',
    notes: 'Annual physical - bring medication list.',
    status: 'upcoming',
  },
  {
    id: 'a2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    dateTime: new Date(2026, 6, 3, 14, 30),
    location: 'Heart & Vascular Institute',
    notes: 'Heart checkup - fasting required.',
    status: 'upcoming',
  },
  {
    id: 'a3',
    doctorName: 'Dr. Emily Rodriguez',
    specialty: 'Endocrinology',
    dateTime: new Date(2026, 4, 20, 9, 0),
    location: 'Diabetes & Hormone Clinic',
    notes: 'Routine diabetes management.',
    status: 'completed',
  },
]

export const useAppointmentsStore = create<AppointmentsState>((set, get) => ({
  appointments: mockAppointments,

  addAppointment: (appt) => set(s => ({
    appointments: [...s.appointments, { ...appt, id: `a${Date.now()}` }],
  })),

  cancelAppointment: (id) => set(s => ({
    appointments: s.appointments.map(a =>
      a.id === id ? { ...a, status: 'cancelled' as AppointmentStatus } : a
    ),
  })),

  rescheduleAppointment: (id, newDateTime) => set(s => ({
    appointments: s.appointments.map(a =>
      a.id === id ? { ...a, dateTime: newDateTime } : a
    ),
  })),

  completeAppointment: (id) => set(s => ({
    appointments: s.appointments.map(a =>
      a.id === id ? { ...a, status: 'completed' as AppointmentStatus } : a
    ),
  })),
}))
