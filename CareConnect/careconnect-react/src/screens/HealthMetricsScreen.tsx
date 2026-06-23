import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Save } from 'lucide-react-native'
import { useHealthMetricsStore } from '../store/healthMetricsStore'
import AppBar from '../components/AppBar'
import ContextBar from '../components/ContextBar'
import Select from '../components/Select'
import type { HealthMetric, MetricStatus } from '../types'
import { C, T, inputBase, btnPrimary } from '../theme/styles'
import type { RootStackParamList } from '../App'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function HealthMetricsScreen() {
  const navigation = useNavigation<Nav>()
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
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <AppBar title="Health Metrics" onBack={() => navigation.goBack()} backLabel="Home" />
      <ContextBar label="Home › Health Metrics" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>

        {/* Vitals Grid - 2 column */}
        <View accessible={false} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          {metrics.map(m => (
            <View key={m.id} style={{ width: '48%' }}>
              <VitalCard metric={m} />
            </View>
          ))}
        </View>

        <Text 
          accessible={true}
          accessibilityRole="header"
          style={{ ...T.headlineMedium, marginBottom: 12 }}
        >
          Add Reading
        </Text>

        <Select
          value={selectedMetricId}
          options={metrics.map(m => ({ label: m.name, value: m.id }))}
          onChange={setSelectedMetricId}
          placeholder="Select metric…"
          style={{ marginBottom: 12 }}
        />

        <TextInput
          accessible={true}
          accessibilityLabel="Metric value"
          accessibilityHint="Enter the reading value for the selected metric"
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter reading value"
          keyboardType="numeric"
          style={{ ...inputBase, marginBottom: 12 }}
        />

        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Save reading"
          accessibilityHint={isAddingReading ? "Saving, please wait" : "Tap to save your health metric reading"}
          accessibilityState={{ disabled: isAddingReading || !selectedMetricId || !inputValue }}
          onPress={handleSave}
          disabled={isAddingReading || !selectedMetricId || !inputValue}
          style={{ ...btnPrimary, opacity: (isAddingReading || !selectedMetricId || !inputValue) ? 0.6 : 1, marginBottom: 28 }}
        >
          {isAddingReading
            ? <><ActivityIndicator size="small" color="white" /><Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Saving…</Text></>
            : <><Save size={18} color="white" /><Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Save Reading</Text></>
          }
        </TouchableOpacity>

        <Text 
          accessible={true}
          accessibilityRole="header"
          style={{ ...T.headlineMedium, marginBottom: 12 }}
        >
          Recent Readings
        </Text>
        {metrics.flatMap(m =>
          [...m.history].reverse().slice(0, 3).map((r, i) => (
            <ReadingRow key={`${m.id}-${i}`} metricName={m.name} unit={m.unit} reading={r} />
          ))
        )}

      </ScrollView>
    </View>
  )
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
    <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <Text numberOfLines={1} style={{ ...T.labelMedium, flex: 1 }}>{metric.name}</Text>
        <View style={{ backgroundColor: sc + '18', borderWidth: 1, borderColor: sc, borderRadius: 10, paddingVertical: 2, paddingHorizontal: 6, marginLeft: 4, flexShrink: 0 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: sc }}>{label}</Text>
        </View>
      </View>
      <Text style={{ ...T.headlineMedium, marginBottom: 2 }}>{metric.displayValue}</Text>
      <Text style={{ ...T.caption, marginBottom: 8 }}>{metric.unit}</Text>

      {values.length > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 20 }}>
          {history.map((r, i) => {
            const range = maxV - minV
            const norm = range === 0 ? 0.5 : (r.value - minV) / range
            const h = 4 + norm * 14
            return (
              <View key={i} style={{ flex: 1, height: h, borderRadius: 2, backgroundColor: C.primary, opacity: 0.4 + norm * 0.6 }} />
            )
          })}
        </View>
      )}
    </View>
  )
}

function ReadingRow({ metricName, unit, reading }: { metricName: string; unit: string; reading: { timestamp: Date; value: number; secondaryValue?: string } }) {
  const dt = reading.timestamp
  const dateStr = `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`
  const valueStr = reading.secondaryValue ? `${reading.value}/${reading.secondaryValue}` : String(reading.value)

  return (
    <View style={{ backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <Text style={{ ...T.labelMedium, flex: 1 }}>{metricName}</Text>
      <Text style={{ ...T.labelLarge, marginRight: 12 }}>{valueStr} {unit}</Text>
      <Text style={{ ...T.caption }}>{dateStr}</Text>
    </View>
  )
}
