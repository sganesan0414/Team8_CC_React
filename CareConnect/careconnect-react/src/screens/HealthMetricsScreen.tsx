import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Activity } from 'lucide-react'
import { useHealthMetricsStore } from '../store/healthMetricsStore'
import AppBar from '../components/AppBar'
import ContextBar from '../components/ContextBar'
import type { HealthMetric, MetricStatus } from '../types'
import { C, T, inputBase, btnPrimary } from '../theme/styles'

export default function HealthMetricsScreen() {
  const navigate = useNavigate()
  const { metrics, isAddingReading, addReading } = useHealthMetricsStore()
  const [selectedMetricId, setSelectedMetricId] = useState('')
  const [inputValue, setInputValue] = useState('')

  const handleSave = async () => {
    if (!selectedMetricId || !inputValue || isAddingReading) return
    const val = parseFloat(inputValue)
    if (isNaN(val)) return
    await addReading(selectedMetricId, val)
    setInputValue('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: C.background }}>
      <AppBar title="Health Metrics" onBack={() => navigate(-1)} backLabel="Home" />
      <ContextBar label="Home › Health Metrics" />

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {/* Vitals Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {metrics.map(m => <VitalCard key={m.id} metric={m} />)}
        </div>

        {/* Add Reading */}
        <h2 style={{ ...T.headlineMedium, marginBottom: 12 }}>Add Reading</h2>

        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Activity size={18} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <select
            value={selectedMetricId}
            onChange={e => setSelectedMetricId(e.target.value)}
            style={{ ...inputBase, paddingLeft: 44, appearance: 'none' }}
          >
            <option value="">Select metric…</option>
            {metrics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        <input
          type="number"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Enter reading value"
          style={{ ...inputBase, marginBottom: 12 }}
        />

        <button
          onClick={handleSave}
          disabled={isAddingReading || !selectedMetricId || !inputValue}
          aria-label="Save reading"
          style={{ ...btnPrimary, opacity: (isAddingReading || !selectedMetricId || !inputValue) ? 0.6 : 1, marginBottom: 28 }}
        >
          {isAddingReading
            ? <><span style={spinnerStyle} /><span>Saving…</span></>
            : <><Save size={18} /><span>Save Reading</span></>
          }
        </button>

        {/* Recent Readings */}
        <h2 style={{ ...T.headlineMedium, marginBottom: 12 }}>Recent Readings</h2>
        {metrics.flatMap(m =>
          [...m.history].reverse().slice(0, 3).map((r, i) => (
            <ReadingRow key={`${m.id}-${i}`} metricName={m.name} unit={m.unit} reading={r} />
          ))
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

const spinnerStyle: React.CSSProperties = {
  width: 18, height: 18,
  border: '2px solid white',
  borderTopColor: 'transparent',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  display: 'inline-block',
}

function statusColor(status: MetricStatus) {
  return status === 'normal' ? C.success : status === 'warning' ? C.warning : C.red
}

function VitalCard({ metric }: { metric: HealthMetric }) {
  const sc = statusColor(metric.status)
  const label = metric.status === 'normal' ? 'Normal' : metric.status === 'warning' ? 'Warning' : 'Critical'
  const history = metric.history.slice(-7)
  const values = history.map(r => r.value)
  const minV = Math.min(...values)
  const maxV = Math.max(...values)

  return (
    <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ ...T.labelMedium, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{metric.name}</span>
        <span style={{
          background: sc + '18', border: `1px solid ${sc}`,
          color: sc, borderRadius: 10, fontSize: 11, fontWeight: 700, padding: '2px 6px', marginLeft: 4, flexShrink: 0,
        }}>{label}</span>
      </div>
      <p style={{ ...T.headlineMedium, marginBottom: 2 }}>{metric.displayValue}</p>
      <p style={{ ...T.caption, marginBottom: 8 }}>{metric.unit}</p>

      {/* Mini sparkline */}
      {values.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 20 }}>
          {history.map((r, i) => {
            const range = maxV - minV
            const norm = range === 0 ? 0.5 : (r.value - minV) / range
            const h = 4 + norm * 14
            return (
              <div key={i} style={{
                flex: 1, height: h, borderRadius: 2,
                background: C.primary, opacity: 0.4 + norm * 0.6,
              }} />
            )
          })}
        </div>
      )}
    </div>
  )
}

function ReadingRow({ metricName, unit, reading }: { metricName: string; unit: string; reading: { timestamp: Date; value: number; secondaryValue?: string } }) {
  const dt = reading.timestamp
  const dateStr = `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`
  const valueStr = reading.secondaryValue ? `${reading.value}/${reading.secondaryValue}` : String(reading.value)

  return (
    <div style={{
      background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
      padding: '12px 16px', display: 'flex', alignItems: 'center', marginBottom: 8,
    }}>
      <span style={{ ...T.labelMedium, flex: 1 }}>{metricName}</span>
      <span style={{ ...T.labelLarge, marginRight: 12 }}>{valueStr} {unit}</span>
      <span style={{ ...T.caption }}>{dateStr}</span>
    </div>
  )
}
