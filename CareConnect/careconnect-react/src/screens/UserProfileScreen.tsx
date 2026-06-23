import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react-native'
import { useAccountStore } from '../store/accountStore'
import AppBar from '../components/AppBar'
import ContextBar from '../components/ContextBar'
import { C, T, inputBase, btnPrimary } from '../theme/styles'
import type { RootStackParamList } from '../App'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function UserProfileScreen() {
  const navigation = useNavigation<Nav>()
  const { displayName, email, avatarInitials, updateProfile } = useAccountStore()

  const [name, setName] = useState(displayName)
  const [phone, setPhone] = useState('(555) 000-0000')
  const [address, setAddress] = useState('123 Main St, Anytown, USA')
  const [dob, setDob] = useState('1980-01-01')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateProfile(name)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <AppBar title="My Profile" onBack={() => navigation.goBack()} />
      <ContextBar label="Settings › My Profile" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>

        {/* Avatar */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <View style={{ position: 'relative' }}>
            <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
              {avatarInitials
                ? <Text style={{ fontSize: 32, fontWeight: '700', color: 'white' }}>{avatarInitials}</Text>
                : <User size={40} color="white" />
              }
            </View>
            <TouchableOpacity
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
              accessibilityHint="Tap to update your profile photo"
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: C.accent, borderWidth: 2, borderColor: 'white',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Camera size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, marginBottom: 20 }}>
          <Text accessible={true} accessibilityRole="header" style={{ ...T.titleLarge, marginBottom: 16 }}>Personal Information</Text>

          {[
            { icon: User,   label: 'Full Name', value: name,    setter: setName,    keyboardType: 'default' as const, disabled: false },
            { icon: Mail,   label: 'Email',     value: email,   setter: () => {},   keyboardType: 'email-address' as const, disabled: true },
            { icon: Phone,  label: 'Phone',     value: phone,   setter: setPhone,   keyboardType: 'phone-pad' as const, disabled: false },
            { icon: MapPin, label: 'Address',   value: address, setter: setAddress, keyboardType: 'default' as const, disabled: false },
          ].map(({ icon: Icon, label, value, setter, keyboardType, disabled }) => (
            <View key={label} style={{ gap: 6, marginBottom: 14 }}>
              <Text style={{ ...T.labelMedium }}>{label}</Text>
              <View style={{ position: 'relative' }}>
                <View style={{ position: 'absolute', left: 14, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 }}>
                  <Icon size={18} color={C.textMuted} />
                </View>
                <TextInput
                  accessible={true}
                  accessibilityLabel={label}
                  accessibilityHint={disabled ? `${label} cannot be changed` : `Enter your ${label.toLowerCase()}`}
                  accessibilityState={{ disabled }}
                  value={value}
                  onChangeText={v => (setter as (v: string) => void)(v)}
                  keyboardType={keyboardType}
                  editable={!disabled}
                  style={{ ...inputBase, paddingLeft: 44, opacity: disabled ? 0.6 : 1 }}
                />
              </View>
            </View>
          ))}

          <View style={{ gap: 6 }}>
            <Text style={{ ...T.labelMedium }}>Date of Birth</Text>
            <TextInput
              accessible={true}
              accessibilityLabel="Date of birth"
              accessibilityHint="Enter your date of birth in year, month, day format"
              value={dob}
              onChangeText={setDob}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
              style={{ ...inputBase }}
            />
          </View>
        </View>

        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={saved ? "Changes saved" : "Save changes"}
          accessibilityHint="Tap to save your profile changes"
          onPress={handleSave}
          style={{ ...btnPrimary, backgroundColor: saved ? C.success : C.primary }}
        >
          <Save size={18} color="white" />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{saved ? 'Saved!' : 'Save Changes'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}
