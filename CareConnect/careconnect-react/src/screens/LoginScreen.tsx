import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, Eye, EyeOff, Fingerprint, Scan, LogIn, Users, Pin } from 'lucide-react'
import { useAccountStore } from '../store/accountStore'
import { C, T, btnPrimary, inputBase } from '../theme/styles'

export default function LoginScreen() {
  const navigate = useNavigate()
  const { signIn, isLoading } = useAccountStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const handleSignIn = async () => {
    if (isLoading) return
    await signIn(email, password)
    navigate('/dashboard', { replace: true })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSignIn()
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.surface }}>
      <div style={{ padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80,
            background: C.primary,
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={42} color="white" />
          </div>
        </div>

        {/* Heading */}
        <h1 style={{ ...T.displayLarge, textAlign: 'center', marginBottom: 8 }}>Welcome Back</h1>
        <p style={{ ...T.bodyMedium, textAlign: 'center', marginBottom: 40 }}>Sign in to continue to CareConnect</p>

        {/* Quick Sign In */}
        <p style={{ ...T.titleLarge, color: C.primary, marginBottom: 14 }}>Quick Sign In</p>
        <div style={{ display: 'flex', gap: 14, marginBottom: 32 }}>
          {[{ icon: Fingerprint, label: 'Fingerprint' }, { icon: Scan, label: 'Face ID' }].map(({ icon: Icon, label }) => (
            <button
              key={label}
              aria-label={`Sign in with ${label}`}
              style={{
                flex: 1, height: 96,
                background: C.surface,
                border: `1.5px solid ${C.border}`,
                borderRadius: 14,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: 'pointer',
              }}
            >
              <Icon size={36} color={C.textPrimary} />
              <span style={{ ...T.labelLarge }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ ...T.caption }}>Or sign in with email</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Email field */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <span style={{ ...T.labelMedium }}>Email</span>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              aria-label="Email address"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              style={{ ...inputBase, paddingLeft: 44, borderColor: emailFocused ? C.primary : C.border, borderWidth: emailFocused ? 2 : 1.5 }}
            />
          </div>
        </label>

        {/* Password field */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 4 }}>
          <span style={{ ...T.labelMedium }}>Password</span>
          <div style={{ position: 'relative' }}>
            <Lock size={18} color={C.textMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              aria-label="Password"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onKeyDown={handleKeyDown}
              style={{ ...inputBase, paddingLeft: 44, paddingRight: 48, borderColor: passwordFocused ? C.primary : C.border, borderWidth: passwordFocused ? 2 : 1.5 }}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex', alignItems: 'center' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        {/* Forgot password */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button style={{ background: 'none', border: 'none', color: C.primary, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Forgot Password?
          </button>
        </div>

        {/* Sign In button */}
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          aria-label="Sign in to your account"
          style={{ ...btnPrimary, marginBottom: 12, opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading
            ? <><span style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /><span>Signing in…</span></>
            : <><LogIn size={20} /><span>Sign In</span></>
          }
        </button>

        {/* Use PIN */}
        <button style={{ ...btnOutlined(C), marginBottom: 8 }}>
          <Pin size={18} />
          <span>Use PIN instead</span>
        </button>

        {/* Create account */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <span style={{ ...T.bodyMedium }}>Don't have an account?</span>
          <button
            onClick={() => navigate('/create-account')}
            style={{ background: 'none', border: 'none', color: C.primary, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
          >
            Create Account
          </button>
        </div>

        {/* Help */}
        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'none', border: 'none', color: C.textMuted, fontSize: 15, cursor: 'pointer', padding: '10px 0' }}>
          <Users size={18} />
          <span>Need help? Contact my Caregiver</span>
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function btnOutlined(C: Record<string, string>) {
  return {
    width: '100%',
    padding: '14px 24px',
    borderRadius: 12,
    background: 'transparent',
    color: C.textSecondary,
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
    border: `1.5px solid ${C.border}`,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
  }
}
