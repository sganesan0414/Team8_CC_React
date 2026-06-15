import { create } from 'zustand'
import type { HealthReport } from '../types'

interface HealthReportsState {
  reports: HealthReport[]
  isGenerating: boolean
  generateReport: (title: string, period: string) => Promise<void>
}

const mockReports: HealthReport[] = [
  {
    id: 'rpt1',
    title: 'Monthly Health Summary',
    period: 'May 2026',
    generatedAt: new Date(2026, 5, 1),
    summary: 'Blood pressure stable at 120/80 mmHg. Heart rate average 72 bpm. Medication adherence 94%. All vitals within normal range.',
  },
  {
    id: 'rpt2',
    title: 'Quarterly Review',
    period: 'Q1 2026',
    generatedAt: new Date(2026, 3, 1),
    summary: 'Overall health trends positive. Consistent medication adherence. Blood glucose levels well-controlled. Recommended continued monitoring.',
  },
]

export const useHealthReportsStore = create<HealthReportsState>((set) => ({
  reports: mockReports,
  isGenerating: false,

  generateReport: async (title, period) => {
    set({ isGenerating: true })
    await new Promise<void>(resolve => setTimeout(resolve, 1500))
    const newReport: HealthReport = {
      id: `rpt${Date.now()}`,
      title,
      period,
      generatedAt: new Date(),
      summary: 'Auto-generated report. All health metrics reviewed and summarized. Consult your care team for detailed analysis.',
    }
    set(s => ({ isGenerating: false, reports: [newReport, ...s.reports] }))
  },
}))
