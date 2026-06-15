import { useHealthMetricsStore } from '../../store/healthMetricsStore'

// Initial mock metrics: 'bp', 'hr', 'temp', 'o2' — each with 7 days of history

const initialState = useHealthMetricsStore.getState()

beforeEach(() => {
  useHealthMetricsStore.setState(initialState, true)
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('healthMetricsStore', () => {
  describe('initial state', () => {
    it('loads 4 mock health metrics', () => {
      expect(useHealthMetricsStore.getState().metrics).toHaveLength(4)
    })

    it('is not adding a reading by default', () => {
      expect(useHealthMetricsStore.getState().isAddingReading).toBe(false)
    })

    it('each metric has an id, name, unit, displayValue, status, and history', () => {
      for (const metric of useHealthMetricsStore.getState().metrics) {
        expect(metric.id).toBeDefined()
        expect(metric.name).toBeDefined()
        expect(metric.unit).toBeDefined()
        expect(metric.displayValue).toBeDefined()
        expect(['normal', 'warning', 'critical']).toContain(metric.status)
        expect(Array.isArray(metric.history)).toBe(true)
      }
    })

    it('each metric starts with 7 historical readings', () => {
      for (const metric of useHealthMetricsStore.getState().metrics) {
        expect(metric.history).toHaveLength(7)
      }
    })

    it('each historical reading has a timestamp and a value', () => {
      for (const metric of useHealthMetricsStore.getState().metrics) {
        for (const reading of metric.history) {
          expect(reading.timestamp).toBeInstanceOf(Date)
          expect(typeof reading.value).toBe('number')
        }
      }
    })

    it('includes Blood Pressure, Heart Rate, Temperature and Oxygen Saturation', () => {
      const ids = useHealthMetricsStore.getState().metrics.map(m => m.id)
      expect(ids).toContain('bp')
      expect(ids).toContain('hr')
      expect(ids).toContain('temp')
      expect(ids).toContain('o2')
    })

    it('Blood Pressure metric has the correct unit and initial displayValue', () => {
      const bp = useHealthMetricsStore.getState().metrics.find(m => m.id === 'bp')!
      expect(bp.unit).toBe('mmHg')
      expect(bp.displayValue).toBe('120/80')
    })

    it('Blood Pressure history readings include a secondaryValue', () => {
      const bp = useHealthMetricsStore.getState().metrics.find(m => m.id === 'bp')!
      for (const reading of bp.history) {
        expect(reading.secondaryValue).toBeDefined()
      }
    })

    it('Heart Rate metric has the correct unit', () => {
      const hr = useHealthMetricsStore.getState().metrics.find(m => m.id === 'hr')!
      expect(hr.unit).toBe('bpm')
    })
  })

  describe('addReading', () => {
    it('sets isAddingReading to true while processing', () => {
      const promise = useHealthMetricsStore.getState().addReading('hr', 75)
      expect(useHealthMetricsStore.getState().isAddingReading).toBe(true)
      jest.runAllTimers()
      return promise
    })

    it('sets isAddingReading to false after completion', async () => {
      const promise = useHealthMetricsStore.getState().addReading('hr', 75)
      jest.runAllTimers()
      await promise
      expect(useHealthMetricsStore.getState().isAddingReading).toBe(false)
    })

    it('appends a new reading to the target metric history', async () => {
      const before = useHealthMetricsStore.getState().metrics.find(m => m.id === 'hr')!.history.length
      const promise = useHealthMetricsStore.getState().addReading('hr', 75)
      jest.runAllTimers()
      await promise
      const after = useHealthMetricsStore.getState().metrics.find(m => m.id === 'hr')!.history.length
      expect(after).toBe(before + 1)
    })

    it('records the correct numeric value in the new reading', async () => {
      const promise = useHealthMetricsStore.getState().addReading('hr', 88)
      jest.runAllTimers()
      await promise
      const history = useHealthMetricsStore.getState().metrics.find(m => m.id === 'hr')!.history
      expect(history.at(-1)!.value).toBe(88)
    })

    it('sets the new reading timestamp to approximately now', async () => {
      const before = new Date()
      const promise = useHealthMetricsStore.getState().addReading('hr', 75)
      jest.runAllTimers()
      await promise
      const after = new Date()
      const reading = useHealthMetricsStore.getState().metrics.find(m => m.id === 'hr')!.history.at(-1)!
      expect(reading.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(reading.timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('updates displayValue to the plain value for non-BP metrics', async () => {
      const promise = useHealthMetricsStore.getState().addReading('hr', 90)
      jest.runAllTimers()
      await promise
      const hr = useHealthMetricsStore.getState().metrics.find(m => m.id === 'hr')!
      expect(hr.displayValue).toBe('90')
    })

    it('updates displayValue to "value/secondary" format when secondaryValue is provided', async () => {
      const promise = useHealthMetricsStore.getState().addReading('bp', 125, '82')
      jest.runAllTimers()
      await promise
      const bp = useHealthMetricsStore.getState().metrics.find(m => m.id === 'bp')!
      expect(bp.displayValue).toBe('125/82')
    })

    it('stores the secondaryValue on the reading when provided', async () => {
      const promise = useHealthMetricsStore.getState().addReading('bp', 125, '82')
      jest.runAllTimers()
      await promise
      const bp = useHealthMetricsStore.getState().metrics.find(m => m.id === 'bp')!
      expect(bp.history.at(-1)!.secondaryValue).toBe('82')
    })

    it('does not affect other metrics', async () => {
      const beforeTemp = useHealthMetricsStore.getState().metrics.find(m => m.id === 'temp')!.history.length
      const promise = useHealthMetricsStore.getState().addReading('hr', 75)
      jest.runAllTimers()
      await promise
      const afterTemp = useHealthMetricsStore.getState().metrics.find(m => m.id === 'temp')!.history.length
      expect(afterTemp).toBe(beforeTemp)
    })

    it('can add readings to multiple metrics independently', async () => {
      const p1 = useHealthMetricsStore.getState().addReading('hr', 80)
      jest.runAllTimers()
      await p1

      const p2 = useHealthMetricsStore.getState().addReading('temp', 98.9)
      jest.runAllTimers()
      await p2

      const hr = useHealthMetricsStore.getState().metrics.find(m => m.id === 'hr')!
      const temp = useHealthMetricsStore.getState().metrics.find(m => m.id === 'temp')!
      expect(hr.history).toHaveLength(8)
      expect(temp.history).toHaveLength(8)
    })
  })
})
