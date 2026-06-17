import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Shield, Mail, Lock, Eye, EyeOff, Fingerprint, Scan, LogIn, Users, Pin, AlertCircle } from 'lucide-react-native'
import { useAccountStore } from '../store/accountStore'
import { C, T, btnPrimary, btnOutlined, inputBase } from '../theme/styles'
import type { RootStackParamList } from '../App'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function LoginScreen() {
  const navigation = useNavigation<Nav>()
  const { signIn, isLoading, authError, clearAuthError, isPinSet, signInWithBiometric, isBiometricLinked } = useAccountStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })
  const [pinAvailable, setPinAvailable] = useState(false)
  const [biometricTypes, setBiometricTypes] = useState<number[]>([])

  useEffect(() => {
    isPinSet().then(setPinAvailable)
    ;(async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      const linked = await isBiometricLinked()
      if (hasHardware && isEnrolled && linked) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
        setBiometricTypes(types)
      }
    })()
  }, [])

  const handleBiometric = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Sign in to CareConnect',
      fallbackLabel: 'Use PIN',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    })
    if (result.success) {
      await signInWithBiometric()
    }
  }

  const validate = () => {
    const errors = { email: '', password: '' }
    if (!email.trim()) errors.email = 'Email is required.'
    if (!password) errors.password = 'Password is required.'
    setFieldErrors(errors)
    return !errors.email && !errors.password
  }

  const handleSignIn = async () => {
    if (isLoading) return
    clearAuthError()
    if (!validate()) return
    await signIn(email, password)
  }

  const handleEmailChange = (v: string) => {
    setEmail(v)
    if (fieldErrors.email) setFieldErrors(e => ({ ...e, email: '' }))
    if (authError) clearAuthError()
  }

  const handlePasswordChange = (v: string) => {
    setPassword(v)
    if (fieldErrors.password) setFieldErrors(e => ({ ...e, password: '' }))
    if (authError) clearAuthError()
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.surface }} contentContainerStyle={{ padding: 40, paddingHorizontal: 28 }}>

      {/* Logo */}
      <View style={{ alignItems: 'center', marginBottom: 28 }}>
        <View style={{ width: 80, height: 80, backgroundColor: C.primary, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={42} color="white" />
        </View>
      </View>

      <Text style={{ ...T.displayLarge, textAlign: 'center', marginBottom: 8 }}>Welcome Back</Text>
      <Text style={{ ...T.bodyMedium, textAlign: 'center', marginBottom: 40 }}>Sign in to continue to CareConnect</Text>

      {/* Quick Sign In */}
      <Text style={{ ...T.titleLarge, color: C.primary, marginBottom: 14 }}>Quick Sign In</Text>
      <View style={{ flexDirection: 'row', gap: 14, marginBottom: 32 }}>
        {[
          { icon: Fingerprint, label: 'Fingerprint', type: LocalAuthentication.AuthenticationType.FINGERPRINT },
          { icon: Scan,        label: 'Face ID',     type: LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION },
        ].map(({ icon: Icon, label, type }) => {
          const available = biometricTypes.includes(type)
          return (
            <TouchableOpacity
              key={label}
              onPress={available ? handleBiometric : undefined}
              style={{
                flex: 1, height: 96, borderRadius: 14,
                alignItems: 'center', justifyContent: 'center', gap: 8,
                backgroundColor: available ? C.primaryLight : C.surface,
                borderWidth: 1.5,
                borderColor: available ? C.primary : C.border,
                opacity: available ? 1 : 0.45,
              }}
            >
              <Icon size={36} color={available ? C.primary : C.textPrimary} />
              <Text style={{ ...T.labelLarge, color: available ? C.primary : C.textPrimary }}>{label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
        <Text style={{ ...T.caption }}>Or sign in with email</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
      </View>

      {/* Auth error banner */}
      {authError ? (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: C.redBg, borderWidth: 1, borderColor: C.red, borderRadius: 10, padding: 12, marginBottom: 16 }}>
          <AlertCircle size={18} color={C.red} style={{ marginTop: 1 }} />
          <Text style={{ color: C.red, fontSize: 14, flex: 1, lineHeight: 20 }}>{authError}</Text>
        </View>
      ) : null}

      {/* Email */}
      <View style={{ gap: 6, marginBottom: 16 }}>
        <Text style={{ ...T.labelMedium }}>Email</Text>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
            <Mail size={18} color={fieldErrors.email ? C.red : C.textMuted} />
          </View>
          <TextInput
            value={email}
            onChangeText={handleEmailChange}
            placeholder="user@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            style={{ ...inputBase, paddingLeft: 44, borderColor: fieldErrors.email ? C.red : emailFocused ? C.primary : C.border, borderWidth: fieldErrors.email || emailFocused ? 2 : 1.5 }}
          />
        </View>
        {fieldErrors.email ? <Text style={{ color: C.red, fontSize: 13 }}>{fieldErrors.email}</Text> : null}
      </View>

      {/* Password */}
      <View style={{ gap: 6, marginBottom: 4 }}>
        <Text style={{ ...T.labelMedium }}>Password</Text>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
            <Lock size={18} color={fieldErrors.password ? C.red : C.textMuted} />
          </View>
          <TextInput
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onSubmitEditing={handleSignIn}
            style={{ ...inputBase, paddingLeft: 44, paddingRight: 48, borderColor: fieldErrors.password ? C.red : passwordFocused ? C.primary : C.border, borderWidth: fieldErrors.password || passwordFocused ? 2 : 1.5 }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' }}
          >
            {showPassword ? <EyeOff size={18} color={C.textMuted} /> : <Eye size={18} color={C.textMuted} />}
          </TouchableOpacity>
        </View>
        {fieldErrors.password ? <Text style={{ color: C.red, fontSize: 13 }}>{fieldErrors.password}</Text> : null}
      </View>

      {/* Forgot password */}
      <View style={{ alignItems: 'flex-end', marginBottom: 24 }}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={{ color: C.primary, fontWeight: '600', fontSize: 14 }}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In */}
      <TouchableOpacity
        onPress={handleSignIn}
        disabled={isLoading}
        style={{ ...btnPrimary, marginBottom: 12, opacity: isLoading ? 0.7 : 1 }}
      >
        {isLoading ? (
          <>
            <ActivityIndicator size="small" color="white" />
            <Text style={{ color: C.textOnPrimary, fontSize: 16, fontWeight: '600' }}>Signing in…</Text>
          </>
        ) : (
          <>
            <LogIn size={20} color={C.textOnPrimary} />
            <Text style={{ color: C.textOnPrimary, fontSize: 16, fontWeight: '600' }}>Sign In</Text>
          </>
        )}
      </TouchableOpacity>

      {/* PIN */}
      {pinAvailable && (
        <TouchableOpacity
          onPress={() => navigation.navigate('PinEntry')}
          style={{ ...btnOutlined, marginBottom: 8 }}
        >
          <Pin size={18} color={C.textPrimary} />
          <Text style={{ color: C.textPrimary, fontSize: 16, fontWeight: '600' }}>Use PIN instead</Text>
        </TouchableOpacity>
      )}

      {/* Create account */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, marginBottom: 8 }}>
        <Text style={{ ...T.bodyMedium }}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
          <Text style={{ color: C.primary, fontWeight: '600', fontSize: 15 }}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Help */}
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 }}>
        <Users size={18} color={C.textMuted} />
        <Text style={{ color: C.textMuted, fontSize: 15 }}>Need help? Contact my Caregiver</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}