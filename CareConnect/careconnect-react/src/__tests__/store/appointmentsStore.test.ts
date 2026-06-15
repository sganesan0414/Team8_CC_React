import { useAppointmentsStore } from '../../store/appointmentsStore'

// Initial mock data IDs: 'a1' (upcoming), 'a2' (upcoming), 'a3' (completed)

const initialState = useAppointmentsStore.getState()

beforeEach(() => {
  useAppointmentsStore.setState(initialState, true)
})

describe('appointmentsStore', () => {
  describe('initial state', () => {
    it('loads 3 mock appointments', () => {
      expect(useAppointmentsStore.getState().appointments).toHaveLength(3)
    })

    it('has two upcoming appointments', () => {
      const upcoming = useAppointmentsStore.getState().appointments.filter(a => a.status === 'upcoming')
      expect(upcoming).toHaveLength(2)
    })

    it('has one completed appointment', () => {
      const completed = useAppointmentsStore.getState().appointments.filter(a => a.status === 'completed')
      expect(completed).toHaveLength(1)
    })

    it('each appointment has required fields', () => {
      for (const appt of useAppointmentsStore.getState().appointments) {
        expect(appt.id).toBeDefined()
        expect(appt.doctorName).toBeDefined()
        expect(appt.specialty).toBeDefined()
        expect(appt.dateTime).toBeInstanceOf(Date)
        expect(appt.location).toBeDefined()
        expect(appt.status).toMatch(/^(upcoming|completed|cancelled)$/)
      }
    })
  })

  describe('addAppointment', () => {
    const newAppt = {
      doctorName: 'Dr. Lisa Park',
      specialty: 'Dermatology',
      dateTime: new Date(2026, 7, 10, 11, 0),
      location: 'Skin Care Clinic',
      notes: 'Annual skin check',
      status: 'upcoming' as const,
    }

    it('increases the appointment count by one', () => {
      useAppointmentsStore.getState().addAppointment(newAppt)
      expect(useAppointmentsStore.getState().appointments).toHaveLength(4)
    })

    it('assigns an id prefixed with "a"', () => {
      useAppointmentsStore.getState().addAppointment(newAppt)
      const added = useAppointmentsStore.getState().appointments.at(-1)!
      expect(added.id).toMatch(/^a/)
    })

    it('preserves all provided appointment fields', () => {
      useAppointmentsStore.getState().addAppointment(newAppt)
      const added = useAppointmentsStore.getState().appointments.at(-1)!
      expect(added.doctorName).toBe('Dr. Lisa Park')
      expect(added.specialty).toBe('Dermatology')
      expect(added.location).toBe('Skin Care Clinic')
      expect(added.notes).toBe('Annual skin check')
      expect(added.status).toBe('upcoming')
    })

    it('can add multiple appointments independently', () => {
      useAppointmentsStore.getState().addAppointment(newAppt)
      useAppointmentsStore.getState().addAppointment({ ...newAppt, doctorName: 'Dr. Karen Lee' })
      expect(useAppointmentsStore.getState().appointments).toHaveLength(5)
    })
  })

  describe('cancelAppointment', () => {
    it('changes the status of the target appointment to "cancelled"', () => {
      useAppointmentsStore.getState().cancelAppointment('a1')
      const appt = useAppointmentsStore.getState().appointments.find(a => a.id === 'a1')
      expect(appt?.status).toBe('cancelled')
    })

    it('does not affect other appointments', () => {
      useAppointmentsStore.getState().cancelAppointment('a1')
      const other = useAppointmentsStore.getState().appointments.find(a => a.id === 'a2')
      expect(other?.status).toBe('upcoming')
    })

    it('does not change the total appointment count', () => {
      useAppointmentsStore.getState().cancelAppointment('a1')
      expect(useAppointmentsStore.getState().appointments).toHaveLength(3)
    })

    it('can cancel a completed appointment (status overwrite)', () => {
      useAppointmentsStore.getState().cancelAppointment('a3')
      expect(useAppointmentsStore.getState().appointments.find(a => a.id === 'a3')?.status).toBe('cancelled')
    })

    it('is a no-op for a non-existent id', () => {
      useAppointmentsStore.getState().cancelAppointment('nonexistent')
      expect(useAppointmentsStore.getState().appointments).toHaveLength(3)
    })
  })

  describe('rescheduleAppointment', () => {
    const newDate = new Date(2026, 9, 1, 9, 0)

    it('updates the dateTime for the target appointment', () => {
      useAppointmentsStore.getState().rescheduleAppointment('a1', newDate)
      const appt = useAppointmentsStore.getState().appointments.find(a => a.id === 'a1')
      expect(appt?.dateTime).toEqual(newDate)
    })

    it('does not affect the dateTime of other appointments', () => {
      const originalDate = useAppointmentsStore.getState().appointments.find(a => a.id === 'a2')!.dateTime
      useAppointmentsStore.getState().rescheduleAppointment('a1', newDate)
      const unchanged = useAppointmentsStore.getState().appointments.find(a => a.id === 'a2')
      expect(unchanged?.dateTime).toEqual(originalDate)
    })

    it('does not change the appointment status', () => {
      useAppointmentsStore.getState().rescheduleAppointment('a1', newDate)
      expect(useAppointmentsStore.getState().appointments.find(a => a.id === 'a1')?.status).toBe('upcoming')
    })

    it('does not change the total appointment count', () => {
      useAppointmentsStore.getState().rescheduleAppointment('a1', newDate)
      expect(useAppointmentsStore.getState().appointments).toHaveLength(3)
    })
  })

  describe('completeAppointment', () => {
    it('changes the status of the target appointment to "completed"', () => {
      useAppointmentsStore.getState().completeAppointment('a1')
      expect(useAppointmentsStore.getState().appointments.find(a => a.id === 'a1')?.status).toBe('completed')
    })

    it('does not affect other appointments', () => {
      useAppointmentsStore.getState().completeAppointment('a1')
      expect(useAppointmentsStore.getState().appointments.find(a => a.id === 'a2')?.status).toBe('upcoming')
    })

    it('is idempotent — completing an already completed appointment stays completed', () => {
      useAppointmentsStore.getState().completeAppointment('a3') // already completed
      expect(useAppointmentsStore.getState().appointments.find(a => a.id === 'a3')?.status).toBe('completed')
    })

    it('does not change the total appointment count', () => {
      useAppointmentsStore.getState().completeAppointment('a1')
      expect(useAppointmentsStore.getState().appointments).toHaveLength(3)
    })

    it('can complete a cancelled appointment', () => {
      useAppointmentsStore.getState().cancelAppointment('a1')
      useAppointmentsStore.getState().completeAppointment('a1')
      expect(useAppointmentsStore.getState().appointments.find(a => a.id === 'a1')?.status).toBe('completed')
    })
  })
})
