import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react-native'
import { useAccountStore } from '../store/accountStore'
import { C, T, btnPrimary, inputBase } from '../theme/styles'
import type { RootStackParamList } from '../App'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<Nav>()
  const { checkEmailExists, forgotPassword } = useAccountStore()

  const [step, setStep] = useState<'email' | 'reset' | 'done'>('email')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSubmit = async () => {
    setError('')
    if (!email.trim()) { setError('Please enter your email address.'); return }
    setIsLoading(true)
    await new Promise<void>(resolve => setTimeout(resolve, 600))
    const exists = await checkEmailExists(email)
    setIsLoading(false)
    if (!exists) {
      setError('No account found with this email. Please check the address or create a new account.')
      return
    }
    setStep('reset')
  }

  const handleReset = async () => {
    setError('')
    if (!newPassword) { setError('Please enter a new password.'); return }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return }
    setIsLoading(true)
    await forgotPassword(email, newPassword)
    setIsLoading(false)
    setStep('done')
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.surface }}
      contentContainerStyle={{ padding: 40, paddingHorizontal: 28 }}
    >

      {/* Back */}
      <TouchableOpacity
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Back"
        accessibilityHint="Go back to sign in screen"
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

      {step === 'done' ? (
        /* Success state */
        <View style={{ alignItems: 'center', gap: 16 }}>
          <CheckCircle size={56} color={C.success} />
          <Text
            accessible={true}
            accessibilityRole="header"
            style={{ ...T.displayLarge, textAlign: 'center' }}
          >
            Password Reset!
          </Text>
          <Text style={{ ...T.bodyMedium, textAlign: 'center', marginBottom: 24 }}>
            Your password has been updated. You can now sign in with your new password.
          </Text>
          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Back to sign in"
            accessibilityHint="Tap to return to the sign in screen"
            onPress={() => navigation.goBack()}
            style={{ ...btnPrimary }}
          >
            <Text style={{ color: C.textOnPrimary, fontSize: 16, fontWeight: '600' }}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      ) : step === 'email' ? (
        /* Step 1 — find account */
        <>
          <Text
            accessible={true}
            accessibilityRole="header"
            style={{ ...T.displayLarge, textAlign: 'center', marginBottom: 8 }}
          >
            Forgot Password
          </Text>
          <Text style={{ ...T.bodyMedium, textAlign: 'center', marginBottom: 36 }}>
            Enter the email address associated with your account.
          </Text>

          {error ? (
            <View
              accessible={true}
              accessibilityRole="alert"
              accessibilityLiveRegion="assertive"
              importantForAccessibility="yes"
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: C.redBg, borderWidth: 1, borderColor: C.red, borderRadius: 10, padding: 12, marginBottom: 16 }}
            >
              <AlertCircle size={18} color={C.red} style={{ marginTop: 1 }} />
              <Text style={{ color: C.red, fontSize: 14, flex: 1, lineHeight: 20 }}>{error}</Text>
            </View>
          ) : null}

          <View style={{ gap: 6, marginBottom: 28 }}>
            <Text style={{ ...T.labelMedium }}>Email</Text>
            <View style={{ position: 'relative' }}>
              <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
                <Mail size={18} color={C.textMuted} />
              </View>
              <TextInput
                accessible={true}
                accessibilityLabel="Email address"
                accessibilityHint={error ? `Error: ${error}` : "Enter the email address associated with your account"}
                value={email}
                onChangeText={v => { setEmail(v); setError('') }}
                placeholder="user@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{ ...inputBase, paddingLeft: 44 }}
              />
            </View>
          </View>

          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Find my account"
            accessibilityHint={isLoading ? "Looking up account, please wait" : "Tap to look up your account by email"}
            accessibilityState={{ disabled: isLoading }}
            onPress={handleEmailSubmit}
            disabled={isLoading}
            style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading
              ? <ActivityIndicator size="small" color="white" />
              : <Text style={{ color: C.textOnPrimary, fontSize: 16, fontWeight: '600' }}>Find My Account</Text>
            }
          </TouchableOpacity>
        </>
      ) : (
        /* Step 2 — set new password */
        <>
          <Text
            accessible={true}
            accessibilityRole="header"
            style={{ ...T.displayLarge, textAlign: 'center', marginBottom: 8 }}
          >
            Reset Password
          </Text>
          <Text style={{ ...T.bodyMedium, textAlign: 'center', marginBottom: 36 }}>
            Choose a new password for{'\n'}
            <Text style={{ fontWeight: '600', color: C.textPrimary }}>{email}</Text>
          </Text>

          {error ? (
            <View
              accessible={true}
              accessibilityRole="alert"
              accessibilityLiveRegion="assertive"
              importantForAccessibility="yes"
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: C.redBg, borderWidth: 1, borderColor: C.red, borderRadius: 10, padding: 12, marginBottom: 16 }}
            >
              <AlertCircle size={18} color={C.red} style={{ marginTop: 1 }} />
              <Text style={{ color: C.red, fontSize: 14, flex: 1, lineHeight: 20 }}>{error}</Text>
            </View>
          ) : null}

          <View style={{ gap: 6, marginBottom: 16 }}>
            <Text style={{ ...T.labelMedium }}>New Password</Text>
            <View style={{ position: 'relative' }}>
              <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
                <Lock size={18} color={C.textMuted} />
              </View>
              <TextInput
                accessible={true}
                accessibilityLabel="New password"
                accessibilityHint="Create a new password, minimum 6 characters"
                value={newPassword}
                onChangeText={v => { setNewPassword(v); setError('') }}
                placeholder="Min. 6 characters"
                secureTextEntry={!showNew}
                style={{ ...inputBase, paddingLeft: 44, paddingRight: 48 }}
              />
              <TouchableOpacity
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={showNew ? "Hide password" : "Show password"}
                accessibilityHint="Toggle password visibility"
                onPress={() => setShowNew(!showNew)}
                style={{ position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' }}
              >
                {showNew ? <EyeOff size={18} color={C.textMuted} /> : <Eye size={18} color={C.textMuted} />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ gap: 6, marginBottom: 28 }}>
            <Text style={{ ...T.labelMedium }}>Confirm Password</Text>
            <View style={{ position: 'relative' }}>
              <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
                <Lock size={18} color={C.textMuted} />
              </View>
              <TextInput
                accessible={true}
                accessibilityLabel="Confirm password"
                accessibilityHint="Re-enter your new password"
                value={confirmPassword}
                onChangeText={v => { setConfirmPassword(v); setError('') }}
                placeholder="Repeat new password"
                secureTextEntry={!showConfirm}
                style={{ ...inputBase, paddingLeft: 44, paddingRight: 48 }}
              />
              <TouchableOpacity
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={showConfirm ? "Hide password" : "Show password"}
                accessibilityHint="Toggle password visibility"
                onPress={() => setShowConfirm(!showConfirm)}
                style={{ position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' }}
              >
                {showConfirm ? <EyeOff size={18} color={C.textMuted} /> : <Eye size={18} color={C.textMuted} />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Reset password"
            accessibilityHint={isLoading ? "Resetting password, please wait" : "Tap to reset your password"}
            accessibilityState={{ disabled: isLoading }}
            onPress={handleReset}
            disabled={isLoading}
            style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading
              ? <ActivityIndicator size="small" color="white" />
              : <Text style={{ color: C.textOnPrimary, fontSize: 16, fontWeight: '600' }}>Reset Password</Text>
            }
          </TouchableOpacity>
        </>
      )}

    </ScrollView>
  )
}
