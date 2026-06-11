import { useState } from 'react'
import { Search, X, CheckCircle, Clock, RefreshCw } from 'lucide-react'
import { useMedicationsStore } from '../store/medicationsStore'
import StatCard from '../components/StatCard'
import { showToast } from '../components/Toast'
import { Pill } from 'lucide-react'
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
    <div style={{ padding: 20 }}>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={18} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          type="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search medications…"
          aria-label="Search medications"
          style={{ ...inputBase, paddingLeft: 44, paddingRight: searchQuery ? 44 : 16 }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} aria-label="Clear search" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        <StatCard icon={Pill}         iconColor={C.primary}  value={String(medications.length)} label="Medications" />
        <StatCard icon={CheckCircle}  iconColor={C.success}  value={String(takenCount)}         label="Taken Today" />
        <StatCard icon={Clock}        iconColor={C.warning}  value={String(medications.length - takenCount)} label="Upcoming" />
      </div>

      {/* Medication cards */}
      {filtered.length === 0 ? (
        <p style={{ ...T.bodyMedium, textAlign: 'center', padding: '40px 0' }}>No medications match your search.</p>
      ) : (
        filtered.map(med => (
          <MedCard key={med.id} med={med} isCooling={!!cooling[med.id]} onMarkTaken={() => handleMarkTaken(med)} />
        ))
      )}
    </div>
  )
}

function MedCard({ med, isCooling, onMarkTaken }: { med: Medication; isCooling: boolean; onMarkTaken: () => void }) {
  const borderColor = med.taken ? C.success : C.primary
  const bgColor = med.taken ? C.successBg : C.infoBg

  return (
    <div style={{ background: bgColor, border: `1.5px solid ${borderColor}`, borderRadius: 16, padding: 18, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ ...T.titleLarge }}>{med.name}</p>
          <p style={{ ...T.bodyMedium, color: borderColor }}>{med.dose}</p>
        </div>
        {med.taken && (
          <span style={{ background: C.successBg, border: `1px solid ${C.success}`, borderRadius: 20, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={13} color={C.success} />
            <span style={{ ...T.caption, color: C.success, fontWeight: 700 }}>Taken</span>
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <Clock size={15} color={C.textMuted} />
        <span style={{ ...T.bodyMedium, fontWeight: 600 }}>{med.times.join(', ')}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <RefreshCw size={15} color={C.textMuted} />
        <span style={{ ...T.bodyMedium }}>{med.schedule}</span>
      </div>

      {!med.taken || isCooling ? (
        <button
          onClick={onMarkTaken}
          disabled={isCooling}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 12,
            background: isCooling ? C.border : C.primary,
            color: 'white', border: 'none', cursor: isCooling ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontWeight: 600, fontSize: 16,
          }}
        >
          {isCooling
            ? <><span style={spinnerStyle} /><span>Marking…</span></>
            : <><CheckCircle size={18} /><span>Mark as Taken</span></>
          }
        </button>
      ) : (
        <div style={{
          width: '100%', padding: '14px 0', borderRadius: 12,
          border: `1.5px solid ${C.success}`, background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          color: C.success, fontWeight: 600, fontSize: 16,
        }}>
          <CheckCircle size={18} />
          <span>Taken</span>
        </div>
      )}
    </div>
  )
}

const spinnerStyle: React.CSSProperties = {
  width: 18, height: 18,
  border: '2px solid white', borderTopColor: 'transparent',
  borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  display: 'inline-block',
}
