export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled'
export type MetricStatus = 'normal' | 'warning' | 'critical'

export interface Medication {
  id: string
  name: string
  dose: string
  schedule: string
  times: string[]
  taken: boolean
}

export interface Appointment {
  id: string
  doctorName: string
  specialty: string
  dateTime: Date
  location: string
  notes: string
  status: AppointmentStatus
}

export interface CareTeamMember {
  id: string
  name: string
  role: string
  phone: string
  email: string
  isEmergencyContact: boolean
}

export interface VitalReading {
  timestamp: Date
  value: number
  secondaryValue?: string
}

export interface HealthMetric {
  id: string
  name: string
  unit: string
  displayValue: string
  status: MetricStatus
  history: VitalReading[]
}

export interface Reminder {
  id: string
  title: string
  description: string
  time: string
  frequency: 'daily' | 'weekly' | 'monthly'
  enabled: boolean
}

export interface HealthReport {
  id: string
  title: string
  period: string
  generatedAt: Date
  summary: string
}
