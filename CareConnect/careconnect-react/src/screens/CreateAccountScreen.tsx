import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, User, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react'
import { useAccountStore } from '../store/accountStore'
import { C, T, btnPrimary, inputBase } from '../theme/styles'

export default function CreateAccountScreen() {
  const navigate = useNavigate()
  const { signIn } = useAccountStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    if (isLoading || !name || !email || !password) return
    setIsLoading(true)
    await signIn(email, password)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.surface }}>
      <div style={{ padding: '40px 28px' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/login')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.textSecondary, cursor: 'pointer', marginBottom: 32, padding: 0 }}
        >
          <ArrowLeft size={20} />
          <span style={{ ...T.bodyMedium }}>Back to Sign In</span>
        </button>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, background: C.primary, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={38} color="white" />
          </div>
        </div>

        <h1 style={{ ...T.displayLarge, textAlign: 'center', marginBottom: 8 }}>Create Account</h1>
        <p style={{ ...T.bodyMedium, textAlign: 'center', marginBottom: 36 }}>Join CareConnect to manage your health</p>

        {/* Full name */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <span style={{ ...T.labelMedium }}>Full Name</span>
          <div style={{ position: 'relative' }}>
            <User size={18} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" style={{ ...inputBase, paddingLeft: 44 }} />
          </div>
        </label>

        {/* Email */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <span style={{ ...T.labelMedium }}>Email</span>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" style={{ ...inputBase, paddingLeft: 44 }} />
          </div>
        </label>

        {/* Password */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          <span style={{ ...T.labelMedium }}>Password</span>
          <div style={{ position: 'relative' }}>
            <Lock size={18} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a strong password"
              style={{ ...inputBase, paddingLeft: 44, paddingRight: 48 }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex', alignItems: 'center' }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <button
          onClick={handleCreate}
          disabled={isLoading || !name || !email || !password}
          style={{ ...btnPrimary, opacity: (isLoading || !name || !email || !password) ? 0.6 : 1 }}
        >
          {isLoading ? <span>Creating account…</span> : <><UserPlus size={20} /><span>Create Account</span></>}
        </button>
      </div>
    </div>
  )
}
