import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, Share2, Calendar } from 'lucide-react'
import { useHealthReportsStore } from '../store/healthReportsStore'
import AppBar from '../components/AppBar'
import ContextBar from '../components/ContextBar'
import { C, T, btnPrimary, inputBase } from '../theme/styles'

const periodOptions = ['May 2026', 'Q2 2026', 'Q1 2026', 'April 2026', 'March 2026', 'Custom Range']

export default function HealthReportsScreen() {
  const navigate = useNavigate()
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: C.background }}>
      <AppBar
        title="Health Reports"
        onBack={() => navigate(-1)}
        backLabel="Home"
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Plus size={16} />
            <span style={{ fontSize: 14 }}>New</span>
          </button>
        }
      />
      <ContextBar label="Home › Health Reports" />

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

        {/* Generate Form */}
        {showForm && (
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, marginBottom: 24 }}>
            <h2 style={{ ...T.titleLarge, marginBottom: 16 }}>Generate New Report</h2>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <span style={{ ...T.labelMedium }}>Report Title</span>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ ...inputBase }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              <span style={{ ...T.labelMedium }}>Period</span>
              <select value={period} onChange={e => setPeriod(e.target.value)} style={{ ...inputBase, appearance: 'none' }}>
                {periodOptions.map(p => <option key={p}>{p}</option>)}
              </select>
            </label>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{ ...btnPrimary, opacity: isGenerating ? 0.6 : 1 }}
            >
              {isGenerating
                ? <><span style={spinnerStyle} /><span>Generating…</span></>
                : <><FileText size={18} /><span>Generate Report</span></>
              }
            </button>
          </div>
        )}

        <h2 style={{ ...T.headlineMedium, marginBottom: 12 }}>Your Reports</h2>

        {reports.length === 0 && (
          <p style={{ ...T.bodyMedium, textAlign: 'center', padding: '40px 0' }}>No reports yet. Generate your first report above.</p>
        )}

        {reports.map(report => (
          <div key={report.id} style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: 18, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={22} color={C.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ ...T.labelLarge, marginBottom: 2 }}>{report.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} color={C.textMuted} />
                  <span style={{ ...T.caption }}>{report.period}</span>
                </div>
              </div>
            </div>
            <p style={{ ...T.bodyMedium, fontSize: 14, marginBottom: 14 }}>{report.summary}</p>
            <button style={{
              width: '100%', padding: '12px 0', borderRadius: 12,
              border: `1.5px solid ${C.border}`, background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              color: C.textSecondary, cursor: 'pointer', fontSize: 15, fontWeight: 500,
            }}>
              <Share2 size={16} />
              Share Report
            </button>
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

const spinnerStyle: React.CSSProperties = {
  width: 18, height: 18,
  border: '2px solid white', borderTopColor: 'transparent',
  borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  display: 'inline-block',
}
