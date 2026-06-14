import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Search, X, CheckCircle, Clock, RefreshCw, Pill } from 'lucide-react-native'
import { useMedicationsStore } from '../store/medicationsStore'
import StatCard from '../components/StatCard'
import { showToast } from '../components/Toast'
import { C, T, inputBase } from '../theme/styles'
import type { Medication } from '../types'

interface Props { onNavChange: (i: number) => void }

export default function MedicationsTab({ onNavChange: _ }: Props) {
  const { medications, searchQuery, setSearchQuery, markTaken, undoTaken } = useMedicationsStore()
  const [cooling, setCooling] = useState<Record<string, boolean>>({})

  const filtered = searchQuery.trim()
    ? medications.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : medications

  const takenCount = medications.filter(m => m.taken).length

  const handleMarkTaken = async (med: Medication) => {
    if (cooling[med.id]) return
    setCooling(c => ({ ...c, [med.id]: true }))
    markTaken(med.id)
    showToast(`${med.name} marked as taken`, {
      label: 'Undo',
      onClick: () => undoTaken(med.id),
    })
    await new Promise(r => setTimeout(r, 1500))
    setCooling(c => ({ ...c, [med.id]: false }))
  }

  return (
    <View style={{ padding: 20 }}>
      {/* Search */}
      <View style={{ position: 'relative', marginBottom: 20 }}>
        <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
          <Search size={18} color={C.textMuted} />
        </View>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search medications…"
          style={{ ...inputBase, paddingLeft: 44, paddingRight: searchQuery ? 44 : 16 }}
        />
        {searchQuery && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={{ position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' }}
          >
            <X size={18} color={C.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        <View style={{ flex: 1 }}><StatCard icon={Pill}        iconColor={C.primary}  value={String(medications.length)} label="Medications" /></View>
        <View style={{ flex: 1 }}><StatCard icon={CheckCircle} iconColor={C.success}  value={String(takenCount)} label="Taken Today" /></View>
        <View style={{ flex: 1 }}><StatCard icon={Clock}       iconColor={C.warning}  value={String(medications.length - takenCount)} label="Upcoming" /></View>
      </View>

      {filtered.length === 0 ? (
        <Text style={{ ...T.bodyMedium, textAlign: 'center', paddingVertical: 40 }}>No medications match your search.</Text>
      ) : (
        filtered.map(med => (
          <MedCard key={med.id} med={med} isCooling={!!cooling[med.id]} onMarkTaken={() => handleMarkTaken(med)} />
        ))
      )}
    </View>
  )
}

function MedCard({ med, isCooling, onMarkTaken }: { med: Medication; isCooling: boolean; onMarkTaken: () => void }) {
  const borderColor = med.taken ? C.success : C.primary
  const bgColor = med.taken ? C.successBg : C.infoBg

  return (
    <View style={{ backgroundColor: bgColor, borderWidth: 1.5, borderColor, borderRadius: 16, padding: 18, marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View>
          <Text style={{ ...T.titleLarge }}>{med.name}</Text>
          <Text style={{ ...T.bodyMedium, color: borderColor }}>{med.dose}</Text>
        </View>
        {med.taken && (
          <View style={{ backgroundColor: C.successBg, borderWidth: 1, borderColor: C.success, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={13} color={C.success} />
            <Text style={{ ...T.caption, color: C.success, fontWeight: '700' }}>Taken</Text>
          </View>
        )}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <Clock size={15} color={C.textMuted} />
        <Text style={{ ...T.bodyMedium, fontWeight: '600' }}>{med.times.join(', ')}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <RefreshCw size={15} color={C.textMuted} />
        <Text style={{ ...T.bodyMedium }}>{med.schedule}</Text>
      </View>

      {!med.taken || isCooling ? (
        <TouchableOpacity
          onPress={onMarkTaken}
          disabled={isCooling}
          style={{
            width: '100%', paddingVertical: 14, borderRadius: 12,
            backgroundColor: isCooling ? C.border : C.primary,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          {isCooling
            ? <><ActivityIndicator size="small" color="white" /><Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Marking…</Text></>
            : <><CheckCircle size={18} color="white" /><Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Mark as Taken</Text></>
          }
        </TouchableOpacity>
      ) : (
        <View style={{
          width: '100%', paddingVertical: 14, borderRadius: 12,
          borderWidth: 1.5, borderColor: C.success, backgroundColor: 'transparent',
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <CheckCircle size={18} color={C.success} />
          <Text style={{ color: C.success, fontWeight: '600', fontSize: 16 }}>Taken</Text>
        </View>
      )}
    </View>
  )
}
