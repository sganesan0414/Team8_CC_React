import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Bell, BellOff, Trash2, Plus, Clock, RefreshCw } from 'lucide-react-native'
import { useRemindersStore } from '../store/remindersStore'
import Select from '../components/Select'
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

  const freqOptions = [
    { label: 'Daily',   value: 'daily' },
    { label: 'Weekly',  value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ]

  return (
    <View style={{ padding: 20 }}>
      {/* Summary */}
      <View
        accessible={true}
        accessibilityLabel={`${enabledCount} active reminders, ${reminders.length - enabledCount} paused`}
        style={{ backgroundColor: C.primary, borderRadius: 16, padding: 20, marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <View>
          <Text style={{ ...T.titleLarge, color: 'white' }}>{enabledCount} Active Reminders</Text>
          <Text style={{ ...T.bodyMedium, color: 'rgba(255,255,255,0.75)' }}>{reminders.length - enabledCount} paused</Text>
        </View>
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={28} color="white" />
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text accessible={true} accessibilityRole="header" style={{ ...T.headlineMedium }}>My Reminders</Text>
        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Add reminder"
          accessibilityHint="Tap to open the new reminder form"
          accessibilityState={{ expanded: showForm }}
          onPress={() => setShowForm(!showForm)}
          style={{ backgroundColor: C.primary, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}
        >
          <Plus size={16} color="white" />
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Add</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <Text accessible={true} accessibilityRole="header" style={{ ...T.titleLarge, marginBottom: 12 }}>New Reminder</Text>

          <View style={{ gap: 4, marginBottom: 10 }}>
            <Text style={{ ...T.labelMedium }}>Title *</Text>
            <TextInput
              accessible={true}
              accessibilityLabel="Title"
              accessibilityHint="Enter a title for this reminder"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Take evening medication"
              style={{ ...inputBase }}
            />
          </View>

          <View style={{ gap: 4, marginBottom: 10 }}>
            <Text style={{ ...T.labelMedium }}>Description</Text>
            <TextInput
              accessible={true}
              accessibilityLabel="Description"
              accessibilityHint="Enter optional details for this reminder"
              value={description}
              onChangeText={setDescription}
              placeholder="Optional details"
              style={{ ...inputBase }}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ ...T.labelMedium }}>Time (HH:MM)</Text>
              <TextInput
                accessible={true}
                accessibilityLabel="Time"
                accessibilityHint="Enter the reminder time in hours and minutes"
                value={time}
                onChangeText={setTime}
                placeholder="08:00"
                keyboardType="numbers-and-punctuation"
                style={{ ...inputBase }}
              />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ ...T.labelMedium }}>Frequency</Text>
              <Select
                value={frequency}
                options={freqOptions}
                onChange={v => setFrequency(v as Reminder['frequency'])}
                placeholder="Frequency"
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Add reminder"
              accessibilityHint="Tap to save the new reminder"
              accessibilityState={{ disabled: !title }}
              onPress={handleAdd}
              disabled={!title}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', opacity: !title ? 0.5 : 1 }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Add Reminder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              accessibilityHint="Tap to close the new reminder form"
              onPress={() => setShowForm(false)}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, backgroundColor: 'transparent', alignItems: 'center' }}
            >
              <Text style={{ fontWeight: '600', color: C.textPrimary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {reminders.length === 0 ? (
        <Text style={{ ...T.bodyMedium, textAlign: 'center', paddingVertical: 40 }}>No reminders yet. Add one above.</Text>
      ) : (
        reminders.map(r => (
          <ReminderCard key={r.id} reminder={r} onToggle={() => toggleReminder(r.id)} onRemove={() => removeReminder(r.id)} />
        ))
      )}
    </View>
  )
}

function ReminderCard({ reminder: r, onToggle, onRemove }: { reminder: Reminder; onToggle: () => void; onRemove: () => void }) {
  const freqLabel = r.frequency === 'daily' ? 'Daily' : r.frequency === 'weekly' ? 'Weekly' : 'Monthly'

  return (
    <View style={{
      backgroundColor: r.enabled ? C.surface : C.surfaceVariant,
      borderWidth: 1.5,
      borderColor: r.enabled ? C.primary : C.border,
      borderRadius: 16, padding: 16, marginBottom: 12,
      opacity: r.enabled ? 1 : 0.75,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ ...T.labelLarge }}>{r.title}</Text>
          {r.description ? <Text style={{ ...T.bodyMedium, fontSize: 14 }}>{r.description}</Text> : null}
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <TouchableOpacity
            accessible={true}
            accessibilityRole="switch"
            accessibilityLabel={r.enabled ? `Pause ${r.title}` : `Resume ${r.title}`}
            accessibilityState={{ checked: r.enabled }}
            onPress={onToggle}
            style={{ padding: 6 }}
          >
            {r.enabled ? <Bell size={20} color={C.primary} /> : <BellOff size={20} color={C.textMuted} />}
          </TouchableOpacity>
          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${r.title}`}
            accessibilityHint="Tap to delete this reminder"
            onPress={onRemove}
            style={{ padding: 6 }}
          >
            <Trash2 size={18} color={C.red} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Clock size={14} color={C.textMuted} />
          <Text style={{ ...T.caption, fontWeight: '600' }}>{r.time}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <RefreshCw size={14} color={C.textMuted} />
          <Text style={{ ...T.caption }}>{freqLabel}</Text>
        </View>
        <View style={{ backgroundColor: r.enabled ? C.primaryLight : C.surfaceVariant, borderWidth: 1, borderColor: r.enabled ? C.primary : C.border, borderRadius: 20, paddingVertical: 2, paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: r.enabled ? C.primary : C.textMuted }}>
            {r.enabled ? 'Active' : 'Paused'}
          </Text>
        </View>
      </View>
    </View>
  )
}
