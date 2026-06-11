import { create } from 'zustand'
import type { HealthMetric, VitalReading } from '../types'

interface HealthMetricsState {
  metrics: HealthMetric[]
  isAddingReading: boolean
  addReading: (metricId: string, value: number, secondaryValue?: string) => Promise<void>
}

const now = new Date()
const d = (offset: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset)

const mockMetrics: HealthMetric[] = [
  {
    id: 'bp',
    name: 'Blood Pressure',
    unit: 'mmHg',
    displayValue: '120/80',
    status: 'normal',
    history: [
      { timestamp: d(6), value: 118, secondaryValue: '76' },
      { timestamp: d(5), value: 122, secondaryValue: '80' },
      { timestamp: d(4), value: 119, secondaryValue: '78' },
      { timestamp: d(3), value: 124, secondaryValue: '82' },
      { timestamp: d(2), value: 121, secondaryValue: '79' },
      { timestamp: d(1), value: 120, secondaryValue: '80' },
      { timestamp: d(0), value: 120, secondaryValue: '80' },
    ],
  },
  {
    id: 'hr',
    name: 'Heart Rate',
    unit: 'bpm',
    displayValue: '72',
    status: 'normal',
    history: [
      { timestamp: d(6), value: 74 },
      { timestamp: d(5), value: 71 },
      { timestamp: d(4), value: 73 },
      { timestamp: d(3), value: 70 },
      { timestamp: d(2), value: 69 },
      { timestamp: d(1), value: 71 },
      { timestamp: d(0), value: 72 },
    ],
  },
  {
    id: 'temp',
    name: 'Temperature',
    unit: '°F',
    displayValue: '98.6',
    status: 'normal',
    history: [
      { timestamp: d(6), value: 98.4 },
      { timestamp: d(5), value: 98.7 },
      { timestamp: d(4), value: 98.5 },
      { timestamp: d(3), value: 98.6 },
      { timestamp: d(2), value: 98.8 },
      { timestamp: d(1), value: 98.5 },
      { timestamp: d(0), value: 98.6 },
    ],
  },
  {
    id: 'o2',
    name: 'Oxygen Saturation',
    unit: '%',
    displayValue: '98',
    status: 'normal',
    history: [
      { timestamp: d(6), value: 97 },
      { timestamp: d(5), value: 98 },
      { timestamp: d(4), value: 99 },
      { timestamp: d(3), value: 98 },
      { timestamp: d(2), value: 97 },
      { timestamp: d(1), value: 98 },
      { timestamp: d(0), value: 98 },
    ],
  },
]

export const useHealthMetricsStore = create<HealthMetricsState>((set) => ({
  metrics: mockMetrics,
  isAddingReading: false,

  addReading: async (metricId, value, secondaryValue) => {
    set({ isAddingReading: true })
    await new Promise(resolve => setTimeout(resolve, 800))
    const reading: VitalReading = { timestamp: new Date(), value, secondaryValue }
    set(s => ({
      isAddingReading: false,
      metrics: s.metrics.map(m =>
        m.id === metricId
          ? { ...m, history: [...m.history, reading], displayValue: secondaryValue ? `${value}/${secondaryValue}` : String(value) }
          : m
      ),
    }))
  },
}))
