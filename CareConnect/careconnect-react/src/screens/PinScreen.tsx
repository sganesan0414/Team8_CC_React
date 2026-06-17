import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ArrowLeft } from 'lucide-react-native'
import { useAccountStore } from '../store/accountStore'
import { C, T } from '../theme/styles'
import type { RootStackParamList } from '../App'

type Nav = NativeStackNavigationProp<RootStackParamList>

const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫']

export default function PinScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute()
  const isSetup = route.name === 'PinSetup'

  const { setPin, signInWithPin, isPinSet } = useAccountStore()

  const [digits, setDigits] = useState('')
  const [firstPin, setFirstPin] = useState('')
  const [step, setStep] = useState<'enter' | 'confirm'>('enter')
  const [error, setError] = useState('')
  const [pinExists, setPinExists] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isSetup) {
      isPinSet().then(setPinExists)
    } else {
      setPinExists(true)
    }
  }, [])

  const title = isSetup
    ? step === 'confirm' ? 'Confirm PIN' : 'Create PIN'
    : 'Enter PIN'

  const subtitle = isSetup
    ? step === 'confirm' ? 'Re-enter your PIN to confirm' : 'Choose a 4-digit PIN'
    : 'Enter your PIN to sign in'

  const handleKey = async (key: string) => {
    if (key === '⌫') {
      setDigits(d => d.slice(0, -1))
      setError('')
      return
    }
    if (key === '' || digits.length >= 4) return

    const newDigits = digits + key
    setDigits(newDigits)
    setError('')

    if (newDigits.length < 4) return

    if (!isSetup) {
      const ok = await signInWithPin(newDigits)
      if (!ok) {
        setError('Incorrect PIN. Try again.')
        setDigits('')
      }
    } else if (step === 'enter') {
      setFirstPin(newDigits)
      setDigits('')
      setStep('confirm')
    } else {
      if (newDigits !== firstPin) {
        setError('PINs do not match. Start over.')
        setDigits('')
        setFirstPin('')
        setStep('enter')
      } else {
        await setPin(newDigits)
        navigation.goBack()
      }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.surface }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', top: 56, left: 24, flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 1 }}
      >
        <ArrowLeft size={20} color={C.textSecondary} />
        <Text style={{ ...T.bodyMedium }}>Back</Text>
      </TouchableOpacity>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>

        {pinExists === false ? (
          <>
            <Text style={{ ...T.displayLarge, textAlign: 'center', marginBottom: 12 }}>No PIN Set</Text>
            <Text style={{ ...T.bodyMedium, textAlign: 'center' }}>
              Sign in with your email first, then set up a PIN in Settings.
            </Text>
          </>
        ) : (
          <>
            <Text style={{ ...T.displayLarge, textAlign: 'center', marginBottom: 8 }}>{title}</Text>
            <Text style={{ ...T.bodyMedium, textAlign: 'center', marginBottom: 48 }}>{subtitle}</Text>

            {/* 4 dots */}
            <View style={{ flexDirection: 'row', gap: 20, marginBottom: 16 }}>
              {[0, 1, 2, 3].map(i => (
                <View
                  key={i}
                  style={{
                    width: 18, height: 18, borderRadius: 9,
                    backgroundColor: i < digits.length ? C.primary : 'transparent',
                    borderWidth: 2,
                    borderColor: i < digits.length ? C.primary : C.border,
                  }}
                />
              ))}
            </View>

            <View style={{ height: 28, marginBottom: 8, justifyContent: 'center' }}>
              {error ? <Text style={{ color: C.red, fontSize: 14, textAlign: 'center' }}>{error}</Text> : null}
            </View>

            {/* Numpad */}
            <View style={{ width: 272 }}>
              {[0, 1, 2, 3].map(row => (
                <View key={row} style={{ flexDirection: 'row', gap: 16, marginBottom: 16, justifyContent: 'center' }}>
                  {KEYS.slice(row * 3, row * 3 + 3).map((key, col) =>
                    key === '' ? (
                      <View key={col} style={{ width: 80, height: 80 }} />
                    ) : (
                      <TouchableOpacity
                        key={col}
                        onPress={() => handleKey(key)}
                        style={{
                          width: 80, height: 80, borderRadius: 40,
                          backgroundColor: key === '⌫' ? 'transparent' : C.surfaceVariant,
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Text style={{
                          fontSize: key === '⌫' ? 22 : 28,
                          fontWeight: '500',
                          color: key === '⌫' ? C.textSecondary : C.textPrimary,
                        }}>
                          {key}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  )
}