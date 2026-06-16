import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Shield, Mail, Lock, User, Eye, EyeOff, UserPlus, ArrowLeft, AlertCircle } from 'lucide-react-native'
import { useAccountStore } from '../store/accountStore'
import { C, T, btnPrimary, inputBase } from '../theme/styles'
import type { RootStackParamList } from '../App'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function CreateAccountScreen() {
  const navigation = useNavigation<Nav>()
  const { createAccount, isLoading, authError, clearAuthError } = useAccountStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', password: '' })

  const validate = () => {
    const errors = { name: '', email: '', password: '' }
    if (!name.trim()) errors.name = 'Full name is required.'
    if (!email.trim()) errors.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(email.trim())) errors.email = 'Please enter a valid email address.'
    if (!password) errors.password = 'Password is required.'
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters.'
    setFieldErrors(errors)
    return !errors.name && !errors.email && !errors.password
  }

  const handleCreate = async () => {
    if (isLoading) return
    clearAuthError()
    if (!validate()) return
    await createAccount(name, email, password)
  }

  const clearField = (field: keyof typeof fieldErrors) => {
    if (fieldErrors[field]) setFieldErrors(e => ({ ...e, [field]: '' }))
    if (authError) clearAuthError()
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.surface }} contentContainerStyle={{ padding: 40, paddingHorizontal: 28 }}>

      {/* Back */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 32 }}
      >
        <ArrowLeft size={20} color={C.textSecondary} />
        <Text style={{ ...T.bodyMedium }}>Back to Sign In</Text>
      </TouchableOpacity>

      {/* Logo */}
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <View style={{ width: 72, height: 72, backgroundColor: C.primary, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={38} color="white" />
        </View>
      </View>

      <Text style={{ ...T.displayLarge, textAlign: 'center', marginBottom: 8 }}>Create Account</Text>
      <Text style={{ ...T.bodyMedium, textAlign: 'center', marginBottom: 36 }}>Join CareConnect to manage your health</Text>

      {/* Auth error banner */}
      {authError ? (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: C.redBg, borderWidth: 1, borderColor: C.red, borderRadius: 10, padding: 12, marginBottom: 16 }}>
          <AlertCircle size={18} color={C.red} style={{ marginTop: 1 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.red, fontSize: 14, lineHeight: 20 }}>{authError}</Text>
            {authError.includes('sign in') && (
              <TouchableOpacity onPress={() => { clearAuthError(); navigation.goBack() }}>
                <Text style={{ color: C.primary, fontWeight: '600', fontSize: 14, marginTop: 4 }}>Go to Sign In →</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : null}

      {/* Full Name */}
      <View style={{ gap: 6, marginBottom: 16 }}>
        <Text style={{ ...T.labelMedium }}>Full Name</Text>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
            <User size={18} color={fieldErrors.name ? C.red : C.textMuted} />
          </View>
          <TextInput
            value={name}
            onChangeText={v => { setName(v); clearField('name') }}
            placeholder="Jane Doe"
            style={{ ...inputBase, paddingLeft: 44, borderColor: fieldErrors.name ? C.red : C.border, borderWidth: fieldErrors.name ? 2 : 1.5 }}
          />
        </View>
        {fieldErrors.name ? <Text style={{ color: C.red, fontSize: 13 }}>{fieldErrors.name}</Text> : null}
      </View>

      {/* Email */}
      <View style={{ gap: 6, marginBottom: 16 }}>
        <Text style={{ ...T.labelMedium }}>Email</Text>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
            <Mail size={18} color={fieldErrors.email ? C.red : C.textMuted} />
          </View>
          <TextInput
            value={email}
            onChangeText={v => { setEmail(v); clearField('email') }}
            placeholder="jane@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ ...inputBase, paddingLeft: 44, borderColor: fieldErrors.email ? C.red : C.border, borderWidth: fieldErrors.email ? 2 : 1.5 }}
          />
        </View>
        {fieldErrors.email ? <Text style={{ color: C.red, fontSize: 13 }}>{fieldErrors.email}</Text> : null}
      </View>

      {/* Password */}
      <View style={{ gap: 6, marginBottom: 28 }}>
        <Text style={{ ...T.labelMedium }}>Password</Text>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
            <Lock size={18} color={fieldErrors.password ? C.red : C.textMuted} />
          </View>
          <TextInput
            value={password}
            onChangeText={v => { setPassword(v); clearField('password') }}
            placeholder="Create a strong password (min. 6 chars)"
            secureTextEntry={!showPassword}
            style={{ ...inputBase, paddingLeft: 44, paddingRight: 48, borderColor: fieldErrors.password ? C.red : C.border, borderWidth: fieldErrors.password ? 2 : 1.5 }}
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

      <TouchableOpacity
        onPress={handleCreate}
        disabled={isLoading}
        style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}
      >
        {isLoading
          ? <ActivityIndicator size="small" color="white" />
          : <><UserPlus size={20} color={C.textOnPrimary} /><Text style={{ color: C.textOnPrimary, fontSize: 16, fontWeight: '600' }}>Create Account</Text></>
        }
      </TouchableOpacity>

    </ScrollView>
  )
}
