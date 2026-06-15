import { useRemindersStore } from '../../store/remindersStore'

// Initial mock data:
// r1: Morning Medications  — daily,   enabled: true
// r2: Blood Pressure Check — daily,   enabled: true
// r3: Evening Medications  — daily,   enabled: true
// r4: Weekly Weight Check  — weekly,  enabled: false

const initialState = useRemindersStore.getState()

beforeEach(() => {
  useRemindersStore.setState(initialState, true)
})

describe('remindersStore', () => {
  describe('initial state', () => {
    it('loads 4 mock reminders', () => {
      expect(useRemindersStore.getState().reminders).toHaveLength(4)
    })

    it('has 3 enabled reminders by default', () => {
      const enabled = useRemindersStore.getState().reminders.filter(r => r.enabled)
      expect(enabled).toHaveLength(3)
    })

    it('has 1 disabled reminder by default', () => {
      const disabled = useRemindersStore.getState().reminders.filter(r => !r.enabled)
      expect(disabled).toHaveLength(1)
    })

    it('each reminder has required fields', () => {
      for (const reminder of useRemindersStore.getState().reminders) {
        expect(reminder.id).toBeDefined()
        expect(reminder.title).toBeDefined()
        expect(reminder.description).toBeDefined()
        expect(reminder.time).toBeDefined()
        expect(['daily', 'weekly', 'monthly']).toContain(reminder.frequency)
        expect(typeof reminder.enabled).toBe('boolean')
      }
    })
  })

  describe('addReminder', () => {
    const newReminder = {
      title: 'Eye Drops',
      description: 'Apply eye drops twice daily',
      time: '10:00 AM',
      frequency: 'daily' as const,
      enabled: true,
    }

    it('increases the reminder count by one', () => {
      useRemindersStore.getState().addReminder(newReminder)
      expect(useRemindersStore.getState().reminders).toHaveLength(5)
    })

    it('assigns an id prefixed with "r"', () => {
      useRemindersStore.getState().addReminder(newReminder)
      const added = useRemindersStore.getState().reminders.at(-1)!
      expect(added.id).toMatch(/^r/)
    })

    it('preserves all provided reminder fields', () => {
      useRemindersStore.getState().addReminder(newReminder)
      const added = useRemindersStore.getState().reminders.at(-1)!
      expect(added.title).toBe('Eye Drops')
      expect(added.description).toBe('Apply eye drops twice daily')
      expect(added.time).toBe('10:00 AM')
      expect(added.frequency).toBe('daily')
      expect(added.enabled).toBe(true)
    })

    it('can add a weekly reminder', () => {
      useRemindersStore.getState().addReminder({ ...newReminder, frequency: 'weekly' })
      const added = useRemindersStore.getState().reminders.at(-1)!
      expect(added.frequency).toBe('weekly')
    })

    it('can add a monthly reminder', () => {
      useRemindersStore.getState().addReminder({ ...newReminder, frequency: 'monthly' })
      const added = useRemindersStore.getState().reminders.at(-1)!
      expect(added.frequency).toBe('monthly')
    })

    it('can add a disabled reminder', () => {
      useRemindersStore.getState().addReminder({ ...newReminder, enabled: false })
      const added = useRemindersStore.getState().reminders.at(-1)!
      expect(added.enabled).toBe(false)
    })
  })

  describe('removeReminder', () => {
    it('removes the specified reminder by id', () => {
      useRemindersStore.getState().removeReminder('r1')
      expect(useRemindersStore.getState().reminders.find(r => r.id === 'r1')).toBeUndefined()
    })

    it('decreases the reminder count by one', () => {
      useRemindersStore.getState().removeReminder('r1')
      expect(useRemindersStore.getState().reminders).toHaveLength(3)
    })

    it('does not remove other reminders', () => {
      useRemindersStore.getState().removeReminder('r1')
      expect(useRemindersStore.getState().reminders.find(r => r.id === 'r2')).toBeDefined()
    })

    it('is a no-op for a non-existent id', () => {
      useRemindersStore.getState().removeReminder('nonexistent')
      expect(useRemindersStore.getState().reminders).toHaveLength(4)
    })

    it('can remove all reminders one by one', () => {
      for (const id of ['r1', 'r2', 'r3', 'r4']) {
        useRemindersStore.getState().removeReminder(id)
      }
      expect(useRemindersStore.getState().reminders).toHaveLength(0)
    })
  })

  describe('toggleReminder', () => {
    it('disables an enabled reminder', () => {
      useRemindersStore.getState().toggleReminder('r1') // r1 starts enabled
      expect(useRemindersStore.getState().reminders.find(r => r.id === 'r1')?.enabled).toBe(false)
    })

    it('enables a disabled reminder', () => {
      useRemindersStore.getState().toggleReminder('r4') // r4 starts disabled
      expect(useRemindersStore.getState().reminders.find(r => r.id === 'r4')?.enabled).toBe(true)
    })

    it('toggling twice returns the reminder to its original state', () => {
      const original = useRemindersStore.getState().reminders.find(r => r.id === 'r1')!.enabled
      useRemindersStore.getState().toggleReminder('r1')
      useRemindersStore.getState().toggleReminder('r1')
      expect(useRemindersStore.getState().reminders.find(r => r.id === 'r1')?.enabled).toBe(original)
    })

    it('does not affect other reminders', () => {
      const beforeOther = useRemindersStore.getState().reminders.find(r => r.id === 'r2')!.enabled
      useRemindersStore.getState().toggleReminder('r1')
      const afterOther = useRemindersStore.getState().reminders.find(r => r.id === 'r2')?.enabled
      expect(afterOther).toBe(beforeOther)
    })

    it('does not change the total reminder count', () => {
      useRemindersStore.getState().toggleReminder('r1')
      expect(useRemindersStore.getState().reminders).toHaveLength(4)
    })
  })

  describe('updateReminder', () => {
    it('updates the title of a reminder', () => {
      useRemindersStore.getState().updateReminder('r1', { title: 'Updated Title' })
      expect(useRemindersStore.getState().reminders.find(r => r.id === 'r1')?.title).toBe('Updated Title')
    })

    it('updates the time of a reminder', () => {
      useRemindersStore.getState().updateReminder('r1', { time: '9:00 AM' })
      expect(useRemindersStore.getState().reminders.find(r => r.id === 'r1')?.time).toBe('9:00 AM')
    })

    it('updates the frequency of a reminder', () => {
      useRemindersStore.getState().updateReminder('r1', { frequency: 'weekly' })
      expect(useRemindersStore.getState().reminders.find(r => r.id === 'r1')?.frequency).toBe('weekly')
    })

    it('can update multiple fields at once', () => {
      useRemindersStore.getState().updateReminder('r1', { title: 'New Title', time: '11:00 AM' })
      const updated = useRemindersStore.getState().reminders.find(r => r.id === 'r1')!
      expect(updated.title).toBe('New Title')
      expect(updated.time).toBe('11:00 AM')
    })

    it('does not overwrite unspecified fields', () => {
      const original = useRemindersStore.getState().reminders.find(r => r.id === 'r1')!
      useRemindersStore.getState().updateReminder('r1', { title: 'New Title' })
      const updated = useRemindersStore.getState().reminders.find(r => r.id === 'r1')!
      expect(updated.description).toBe(original.description)
      expect(updated.time).toBe(original.time)
      expect(updated.frequency).toBe(original.frequency)
      expect(updated.enabled).toBe(original.enabled)
    })

    it('does not affect other reminders', () => {
      const original = useRemindersStore.getState().reminders.find(r => r.id === 'r2')!
      useRemindersStore.getState().updateReminder('r1', { title: 'Changed' })
      const unchanged = useRemindersStore.getState().reminders.find(r => r.id === 'r2')!
      expect(unchanged.title).toBe(original.title)
    })
  })
})
