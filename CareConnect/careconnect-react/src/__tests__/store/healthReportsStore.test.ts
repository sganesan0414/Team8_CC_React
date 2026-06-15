import { useHealthReportsStore } from '../../store/healthReportsStore'

// Initial mock data:
// rpt1: Monthly Health Summary — May 2026
// rpt2: Quarterly Review       — Q1 2026

const initialState = useHealthReportsStore.getState()

beforeEach(() => {
  useHealthReportsStore.setState(initialState, true)
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('healthReportsStore', () => {
  describe('initial state', () => {
    it('loads 2 mock reports', () => {
      expect(useHealthReportsStore.getState().reports).toHaveLength(2)
    })

    it('is not generating a report by default', () => {
      expect(useHealthReportsStore.getState().isGenerating).toBe(false)
    })

    it('each report has required fields', () => {
      for (const report of useHealthReportsStore.getState().reports) {
        expect(report.id).toBeDefined()
        expect(report.title).toBeDefined()
        expect(report.period).toBeDefined()
        expect(report.generatedAt).toBeInstanceOf(Date)
        expect(typeof report.summary).toBe('string')
        expect(report.summary.length).toBeGreaterThan(0)
      }
    })

    it('includes a monthly health summary report', () => {
      const report = useHealthReportsStore.getState().reports.find(r => r.id === 'rpt1')!
      expect(report.title).toBe('Monthly Health Summary')
      expect(report.period).toBe('May 2026')
    })

    it('includes a quarterly review report', () => {
      const report = useHealthReportsStore.getState().reports.find(r => r.id === 'rpt2')!
      expect(report.title).toBe('Quarterly Review')
      expect(report.period).toBe('Q1 2026')
    })
  })

  describe('generateReport', () => {
    it('sets isGenerating to true while generating', () => {
      const promise = useHealthReportsStore.getState().generateReport('Test Report', 'June 2026')
      expect(useHealthReportsStore.getState().isGenerating).toBe(true)
      jest.runAllTimers()
      return promise
    })

    it('sets isGenerating to false after generation completes', async () => {
      const promise = useHealthReportsStore.getState().generateReport('Test Report', 'June 2026')
      jest.runAllTimers()
      await promise
      expect(useHealthReportsStore.getState().isGenerating).toBe(false)
    })

    it('increases the report count by one', async () => {
      const promise = useHealthReportsStore.getState().generateReport('Test Report', 'June 2026')
      jest.runAllTimers()
      await promise
      expect(useHealthReportsStore.getState().reports).toHaveLength(3)
    })

    it('prepends the new report at the front of the list', async () => {
      const promise = useHealthReportsStore.getState().generateReport('New Report', 'June 2026')
      jest.runAllTimers()
      await promise
      expect(useHealthReportsStore.getState().reports[0].title).toBe('New Report')
    })

    it('assigns the provided title to the new report', async () => {
      const promise = useHealthReportsStore.getState().generateReport('Annual Review', 'Year 2026')
      jest.runAllTimers()
      await promise
      const newest = useHealthReportsStore.getState().reports[0]
      expect(newest.title).toBe('Annual Review')
    })

    it('assigns the provided period to the new report', async () => {
      const promise = useHealthReportsStore.getState().generateReport('Annual Review', 'Year 2026')
      jest.runAllTimers()
      await promise
      const newest = useHealthReportsStore.getState().reports[0]
      expect(newest.period).toBe('Year 2026')
    })

    it('assigns an id prefixed with "rpt"', async () => {
      const promise = useHealthReportsStore.getState().generateReport('Test', 'June 2026')
      jest.runAllTimers()
      await promise
      const newest = useHealthReportsStore.getState().reports[0]
      expect(newest.id).toMatch(/^rpt/)
    })

    it('sets generatedAt to approximately now', async () => {
      const before = new Date()
      const promise = useHealthReportsStore.getState().generateReport('Test', 'June 2026')
      jest.runAllTimers()
      await promise
      const after = new Date()
      const newest = useHealthReportsStore.getState().reports[0]
      expect(newest.generatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(newest.generatedAt.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('populates an auto-generated summary on the new report', async () => {
      const promise = useHealthReportsStore.getState().generateReport('Test', 'June 2026')
      jest.runAllTimers()
      await promise
      const newest = useHealthReportsStore.getState().reports[0]
      expect(typeof newest.summary).toBe('string')
      expect(newest.summary.length).toBeGreaterThan(0)
    })

    it('preserves existing reports after generation', async () => {
      const promise = useHealthReportsStore.getState().generateReport('New', 'June 2026')
      jest.runAllTimers()
      await promise
      const ids = useHealthReportsStore.getState().reports.map(r => r.id)
      expect(ids).toContain('rpt1')
      expect(ids).toContain('rpt2')
    })

    it('can generate multiple reports sequentially', async () => {
      const p1 = useHealthReportsStore.getState().generateReport('Report A', 'June 2026')
      jest.runAllTimers()
      await p1

      const p2 = useHealthReportsStore.getState().generateReport('Report B', 'July 2026')
      jest.runAllTimers()
      await p2

      expect(useHealthReportsStore.getState().reports).toHaveLength(4)
    })
  })
})
