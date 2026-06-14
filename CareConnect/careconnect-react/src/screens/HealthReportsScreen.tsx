import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { FileText, Plus, Share2, Calendar } from 'lucide-react-native'
import { useHealthReportsStore } from '../store/healthReportsStore'
import AppBar from '../components/AppBar'
import ContextBar from '../components/ContextBar'
import Select from '../components/Select'
import { C, T, btnPrimary, inputBase } from '../theme/styles'
import type { RootStackParamList } from '../App'

type Nav = NativeStackNavigationProp<RootStackParamList>

const periodOptions = ['May 2026', 'Q2 2026', 'Q1 2026', 'April 2026', 'March 2026', 'Custom Range']

export default function HealthReportsScreen() {
  const navigation = useNavigation<Nav>()
  const { reports, isGenerating, generateReport } = useHealthReportsStore()
  const [title, setTitle] = useState('Monthly Health Summary')
  const [period, setPeriod] = useState(periodOptions[0])
  const [showForm, setShowForm] = useState(false)

  const handleGenerate = async () => {
    if (!title || isGenerating) return
    await generateReport(title, period)
    setShowForm(false)
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <AppBar
        title="Health Reports"
        onBack={() => navigation.goBack()}
        backLabel="Home"
        actions={
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Plus size={16} color="white" />
            <Text style={{ fontSize: 14, color: 'white' }}>New</Text>
          </TouchableOpacity>
        }
      />
      <ContextBar label="Home › Health Reports" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>

        {showForm && (
          <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, marginBottom: 24 }}>
            <Text style={{ ...T.titleLarge, marginBottom: 16 }}>Generate New Report</Text>

            <View style={{ gap: 6, marginBottom: 12 }}>
              <Text style={{ ...T.labelMedium }}>Report Title</Text>
              <TextInput value={title} onChangeText={setTitle} style={{ ...inputBase }} />
            </View>

            <View style={{ gap: 6, marginBottom: 16 }}>
              <Text style={{ ...T.labelMedium }}>Period</Text>
              <Select
                value={period}
                options={periodOptions.map(p => ({ label: p, value: p }))}
                onChange={setPeriod}
                placeholder="Select period"
              />
            </View>

            <TouchableOpacity
              onPress={handleGenerate}
              disabled={isGenerating}
              style={{ ...btnPrimary, opacity: isGenerating ? 0.6 : 1 }}
            >
              {isGenerating
                ? <><ActivityIndicator size="small" color="white" /><Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Generating…</Text></>
                : <><FileText size={18} color="white" /><Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Generate Report</Text></>
              }
            </TouchableOpacity>
          </View>
        )}

        <Text style={{ ...T.headlineMedium, marginBottom: 12 }}>Your Reports</Text>

        {reports.length === 0 && (
          <Text style={{ ...T.bodyMedium, textAlign: 'center', paddingVertical: 40 }}>No reports yet. Generate your first report above.</Text>
        )}

        {reports.map(report => (
          <View key={report.id} style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 18, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={22} color={C.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...T.labelLarge, marginBottom: 2 }}>{report.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} color={C.textMuted} />
                  <Text style={{ ...T.caption }}>{report.period}</Text>
                </View>
              </View>
            </View>
            <Text style={{ ...T.bodyMedium, fontSize: 14, marginBottom: 14 }}>{report.summary}</Text>
            <TouchableOpacity style={{
              width: '100%', paddingVertical: 12, borderRadius: 12,
              borderWidth: 1.5, borderColor: C.border, backgroundColor: 'transparent',
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Share2 size={16} color={C.textSecondary} />
              <Text style={{ color: C.textSecondary, fontSize: 15, fontWeight: '500' }}>Share Report</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </View>
  )
}
