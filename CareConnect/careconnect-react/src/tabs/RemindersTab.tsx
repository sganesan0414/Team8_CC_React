import { useState } from 'react'
import { Bell, BellOff, Trash2, Plus, Clock, RefreshCw } from 'lucide-react'
import { useRemindersStore } from '../store/remindersStore'
import type { Reminder } from '../types'
import { C, T, inputBase } from '../theme/styles'

interface Props { onNavChange: (i: number) => void }

export default function RemindersTab({ onNavChange: _ }: Props) {
  const { reminders, addReminder, removeReminder, toggleReminder } = useRemindersStore()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [time, setTime] = useState('08:00')
  const [frequency, setFrequency] = useState<Reminder['frequency']>('daily')

  const enabledCount = reminders.filter(r => r.enabled).length

  const handleAdd = () => {
    if (!title) return
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const period = hour >= 12 ? 'PM' : 'AM'
    const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    const timeLabel = `${h12}:${m} ${period}`
    addReminder({ title, description, time: timeLabel, frequency, enabled: true })
    setShowForm(false)
    setTitle(''); setDescription(''); setTime('08:00'); setFrequency('daily')
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Summary */}
      <div style={{ background: C.primary, borderRadius: 16, padding: 20, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ ...T.titleLarge, color: 'white' }}>{enabledCount} Active Reminders</p>
          <p style={{ ...T.bodyMedium, color: 'rgba(255,255,255,0.75)' }}>{reminders.length - enabledCount} paused</p>
        </div>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={28} color="white" />
        </div>
      </div>

      {/* Add button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ ...T.headlineMedium }}>My Reminders</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: C.primary, border: 'none', color: 'white', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600 }}
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <h3 style={{ ...T.titleLarge, marginBottom: 12 }}>New Reminder</h3>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
            <span style={{ ...T.labelMedium }}>Title *</span>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Take evening medication" style={{ ...inputBase }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
            <span style={{ ...T.labelMedium }}>Description</span>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional details" style={{ ...inputBase }} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ ...T.labelMedium }}>Time</span>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ ...inputBase }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ ...T.labelMedium }}>Frequency</span>
              <select value={frequency} onChange={e => setFrequency(e.target.value as Reminder['frequency'])} style={{ ...inputBase, appearance: 'none' }}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleAdd} disabled={!title} style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: C.primary, color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: !title ? 0.5 : 1 }}>Add Reminder</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Reminder cards */}
      {reminders.length === 0 ? (
        <p style={{ ...T.bodyMedium, textAlign: 'center', padding: '40px 0' }}>No reminders yet. Add one above.</p>
      ) : (
        reminders.map(r => (
          <ReminderCard key={r.id} reminder={r} onToggle={() => toggleReminder(r.id)} onRemove={() => removeReminder(r.id)} />
        ))
      )}
    </div>
  )
}

function ReminderCard({ reminder: r, onToggle, onRemove }: { reminder: Reminder; onToggle: () => void; onRemove: () => void }) {
  const freqLabel = r.frequency === 'daily' ? 'Daily' : r.frequency === 'weekly' ? 'Weekly' : 'Monthly'

  return (
    <div style={{
      background: r.enabled ? C.surface : C.surfaceVariant,
      border: `1.5px solid ${r.enabled ? C.primary : C.border}`,
      borderRadius: 16, padding: 16, marginBottom: 12,
      opacity: r.enabled ? 1 : 0.75,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <p style={{ ...T.labelLarge }}>{r.title}</p>
          {r.description && <p style={{ ...T.bodyMedium, fontSize: 14 }}>{r.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={onToggle} title={r.enabled ? 'Pause reminder' : 'Enable reminder'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: r.enabled ? C.primary : C.textMuted }}>
            {r.enabled ? <Bell size={20} /> : <BellOff size={20} />}
          </button>
          <button onClick={onRemove} title="Delete reminder" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: C.red }}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock size={14} color={C.textMuted} />
          <span style={{ ...T.caption, fontWeight: 600 }}>{r.time}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <RefreshCw size={14} color={C.textMuted} />
          <span style={{ ...T.caption }}>{freqLabel}</span>
        </div>
        <span style={{
          background: r.enabled ? C.primaryLight : C.surfaceVariant,
          border: `1px solid ${r.enabled ? C.primary : C.border}`,
          color: r.enabled ? C.primary : C.textMuted,
          borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700,
        }}>
          {r.enabled ? 'Active' : 'Paused'}
        </span>
      </div>
    </div>
  )
}
