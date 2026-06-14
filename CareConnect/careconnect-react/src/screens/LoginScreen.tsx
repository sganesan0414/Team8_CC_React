import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Shield, Mail, Lock, Eye, EyeOff, Fingerprint, Scan, LogIn, Users, Pin } from 'lucide-react-native'
import { useAccountStore } from '../store/accountStore'
import { C, T, btnPrimary, btnOutlined, inputBase } from '../theme/styles'
import type { RootStackParamList } from '../App'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function LoginScreen() {
  const navigation = useNavigation<Nav>()
  const { signIn, isLoading } = useAccountStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const handleSignIn = async () => {
    if (isLoading) return
    await signIn(email, password)
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
        {[{ icon: Fingerprint, label: 'Fingerprint' }, { icon: Scan, label: 'Face ID' }].map(({ icon: Icon, label }) => (
          <TouchableOpacity key={label} style={{ flex: 1, height: 96, backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Icon size={36} color={C.textPrimary} />
            <Text style={{ ...T.labelLarge }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
        <Text style={{ ...T.caption }}>Or sign in with email</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
      </View>

      {/* Email */}
      <View style={{ gap: 6, marginBottom: 16 }}>
        <Text style={{ ...T.labelMedium }}>Email</Text>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
            <Mail size={18} color={C.textMuted} />
          </View>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="user@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            style={{ ...inputBase, paddingLeft: 44, borderColor: emailFocused ? C.primary : C.border, borderWidth: emailFocused ? 2 : 1.5 }}
          />
        </View>
      </View>

      {/* Password */}
      <View style={{ gap: 6, marginBottom: 4 }}>
        <Text style={{ ...T.labelMedium }}>Password</Text>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
            <Lock size={18} color={C.textMuted} />
          </View>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onSubmitEditing={handleSignIn}
            style={{ ...inputBase, paddingLeft: 44, paddingRight: 48, borderColor: passwordFocused ? C.primary : C.border, borderWidth: passwordFocused ? 2 : 1.5 }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' }}
          >
            {showPassword ? <EyeOff size={18} color={C.textMuted} /> : <Eye size={18} color={C.textMuted} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot password */}
      <View style={{ alignItems: 'flex-end', marginBottom: 24 }}>
        <TouchableOpacity>
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
      <TouchableOpacity style={{ ...btnOutlined, marginBottom: 8 }}>
        <Pin size={18} color={C.textPrimary} />
        <Text style={{ color: C.textPrimary, fontSize: 16, fontWeight: '600' }}>Use PIN instead</Text>
      </TouchableOpacity>

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
