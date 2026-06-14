import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Shield, Mail, Lock, User, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react-native'
import { useAccountStore } from '../store/accountStore'
import { C, T, btnPrimary, inputBase } from '../theme/styles'
import type { RootStackParamList } from '../App'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function CreateAccountScreen() {
  const navigation = useNavigation<Nav>()
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

      {/* Full Name */}
      <View style={{ gap: 6, marginBottom: 16 }}>
        <Text style={{ ...T.labelMedium }}>Full Name</Text>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
            <User size={18} color={C.textMuted} />
          </View>
          <TextInput value={name} onChangeText={setName} placeholder="Jane Doe" style={{ ...inputBase, paddingLeft: 44 }} />
        </View>
      </View>

      {/* Email */}
      <View style={{ gap: 6, marginBottom: 16 }}>
        <Text style={{ ...T.labelMedium }}>Email</Text>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
            <Mail size={18} color={C.textMuted} />
          </View>
          <TextInput value={email} onChangeText={setEmail} placeholder="jane@example.com" keyboardType="email-address" autoCapitalize="none" style={{ ...inputBase, paddingLeft: 44 }} />
        </View>
      </View>

      {/* Password */}
      <View style={{ gap: 6, marginBottom: 28 }}>
        <Text style={{ ...T.labelMedium }}>Password</Text>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
            <Lock size={18} color={C.textMuted} />
          </View>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Create a strong password"
            secureTextEntry={!showPassword}
            style={{ ...inputBase, paddingLeft: 44, paddingRight: 48 }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' }}
          >
            {showPassword ? <EyeOff size={18} color={C.textMuted} /> : <Eye size={18} color={C.textMuted} />}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleCreate}
        disabled={isLoading || !name || !email || !password}
        style={{ ...btnPrimary, opacity: (isLoading || !name || !email || !password) ? 0.6 : 1 }}
      >
        {isLoading
          ? <ActivityIndicator size="small" color="white" />
          : <><UserPlus size={20} color={C.textOnPrimary} /><Text style={{ color: C.textOnPrimary, fontSize: 16, fontWeight: '600' }}>Create Account</Text></>
        }
      </TouchableOpacity>

    </ScrollView>
  )
}
