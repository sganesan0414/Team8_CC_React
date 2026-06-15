import { useMedicationsStore } from '../../store/medicationsStore'

// Mock IDs from initial mock data
// taken=true: '2' (Metformin), '5' (Levothyroxine)
// taken=false: '1' (Lisinopril), '3' (Atorvastatin), '4' (Aspirin), '6' (Omeprazole)

const initialState = useMedicationsStore.getState()

beforeEach(() => {
  useMedicationsStore.setState(initialState, true)
})

describe('medicationsStore', () => {
  describe('initial state', () => {
    it('loads 6 mock medications', () => {
      expect(useMedicationsStore.getState().medications).toHaveLength(6)
    })

    it('starts with an empty searchQuery', () => {
      expect(useMedicationsStore.getState().searchQuery).toBe('')
    })

    it('has some medications already marked as taken', () => {
      const taken = useMedicationsStore.getState().medications.filter(m => m.taken)
      expect(taken.length).toBeGreaterThan(0)
    })

    it('has some medications not yet taken', () => {
      const notTaken = useMedicationsStore.getState().medications.filter(m => !m.taken)
      expect(notTaken.length).toBeGreaterThan(0)
    })

    it('each medication has required fields', () => {
      for (const med of useMedicationsStore.getState().medications) {
        expect(med.id).toBeDefined()
        expect(med.name).toBeDefined()
        expect(med.dose).toBeDefined()
        expect(med.schedule).toBeDefined()
        expect(Array.isArray(med.times)).toBe(true)
        expect(typeof med.taken).toBe('boolean')
      }
    })
  })

  describe('markTaken', () => {
    it('marks a not-taken medication as taken', () => {
      useMedicationsStore.getState().markTaken('1') // Lisinopril starts not taken
      const med = useMedicationsStore.getState().medications.find(m => m.id === '1')
      expect(med?.taken).toBe(true)
    })

    it('does not affect other medications', () => {
      const beforeOther = useMedicationsStore.getState().medications.find(m => m.id === '2')?.taken
      useMedicationsStore.getState().markTaken('1')
      const afterOther = useMedicationsStore.getState().medications.find(m => m.id === '2')?.taken
      expect(afterOther).toBe(beforeOther)
    })

    it('is idempotent — marking already-taken medication stays taken', () => {
      useMedicationsStore.getState().markTaken('2') // Metformin starts taken
      expect(useMedicationsStore.getState().medications.find(m => m.id === '2')?.taken).toBe(true)
    })

    it('does not change the total medication count', () => {
      useMedicationsStore.getState().markTaken('1')
      expect(useMedicationsStore.getState().medications).toHaveLength(6)
    })

    it('silently ignores a non-existent id', () => {
      useMedicationsStore.getState().markTaken('nonexistent')
      expect(useMedicationsStore.getState().medications).toHaveLength(6)
    })
  })

  describe('undoTaken', () => {
    it('marks a taken medication as not taken', () => {
      useMedicationsStore.getState().undoTaken('2') // Metformin starts taken
      expect(useMedicationsStore.getState().medications.find(m => m.id === '2')?.taken).toBe(false)
    })

    it('does not affect other medications', () => {
      const beforeOther = useMedicationsStore.getState().medications.find(m => m.id === '1')?.taken
      useMedicationsStore.getState().undoTaken('2')
      const afterOther = useMedicationsStore.getState().medications.find(m => m.id === '1')?.taken
      expect(afterOther).toBe(beforeOther)
    })

    it('reverses a previous markTaken', () => {
      useMedicationsStore.getState().markTaken('1')
      useMedicationsStore.getState().undoTaken('1')
      expect(useMedicationsStore.getState().medications.find(m => m.id === '1')?.taken).toBe(false)
    })

    it('does not change the total medication count', () => {
      useMedicationsStore.getState().undoTaken('2')
      expect(useMedicationsStore.getState().medications).toHaveLength(6)
    })
  })

  describe('setSearchQuery', () => {
    it('updates the searchQuery', () => {
      useMedicationsStore.getState().setSearchQuery('Aspirin')
      expect(useMedicationsStore.getState().searchQuery).toBe('Aspirin')
    })

    it('replaces a previous query', () => {
      useMedicationsStore.getState().setSearchQuery('Aspirin')
      useMedicationsStore.getState().setSearchQuery('Metformin')
      expect(useMedicationsStore.getState().searchQuery).toBe('Metformin')
    })

    it('can clear the search query with an empty string', () => {
      useMedicationsStore.getState().setSearchQuery('Aspirin')
      useMedicationsStore.getState().setSearchQuery('')
      expect(useMedicationsStore.getState().searchQuery).toBe('')
    })
  })

  describe('addMedication', () => {
    const newMed = {
      name: 'Vitamin D',
      dose: '1000 IU',
      schedule: 'Daily',
      times: ['9:00 AM'],
      taken: false,
    }

    it('increases the medication count by one', () => {
      useMedicationsStore.getState().addMedication(newMed)
      expect(useMedicationsStore.getState().medications).toHaveLength(7)
    })

    it('assigns a string id to the new medication', () => {
      useMedicationsStore.getState().addMedication(newMed)
      const added = useMedicationsStore.getState().medications.at(-1)!
      expect(typeof added.id).toBe('string')
      expect(added.id.length).toBeGreaterThan(0)
    })

    it('preserves all provided medication fields', () => {
      useMedicationsStore.getState().addMedication(newMed)
      const added = useMedicationsStore.getState().medications.at(-1)!
      expect(added.name).toBe('Vitamin D')
      expect(added.dose).toBe('1000 IU')
      expect(added.schedule).toBe('Daily')
      expect(added.times).toEqual(['9:00 AM'])
      expect(added.taken).toBe(false)
    })

    it('appends the new medication at the end of the list', () => {
      useMedicationsStore.getState().addMedication(newMed)
      const meds = useMedicationsStore.getState().medications
      expect(meds[meds.length - 1].name).toBe('Vitamin D')
    })

    it('can add multiple medications independently', () => {
      useMedicationsStore.getState().addMedication({ ...newMed, name: 'Vitamin C' })
      useMedicationsStore.getState().addMedication({ ...newMed, name: 'Magnesium' })
      expect(useMedicationsStore.getState().medications).toHaveLength(8)
    })
  })

  describe('removeMedication', () => {
    it('removes the specified medication by id', () => {
      useMedicationsStore.getState().removeMedication('1')
      expect(useMedicationsStore.getState().medications.find(m => m.id === '1')).toBeUndefined()
    })

    it('decreases the medication count by one', () => {
      useMedicationsStore.getState().removeMedication('1')
      expect(useMedicationsStore.getState().medications).toHaveLength(5)
    })

    it('does not remove other medications', () => {
      useMedicationsStore.getState().removeMedication('1')
      expect(useMedicationsStore.getState().medications.find(m => m.id === '2')).toBeDefined()
    })

    it('is a no-op for a non-existent id', () => {
      useMedicationsStore.getState().removeMedication('nonexistent')
      expect(useMedicationsStore.getState().medications).toHaveLength(6)
    })

    it('can remove all medications one by one', () => {
      for (const id of ['1', '2', '3', '4', '5', '6']) {
        useMedicationsStore.getState().removeMedication(id)
      }
      expect(useMedicationsStore.getState().medications).toHaveLength(0)
    })
  })
})
