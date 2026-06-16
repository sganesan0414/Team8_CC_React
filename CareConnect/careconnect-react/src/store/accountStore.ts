import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ACCOUNTS_KEY = 'cc_accounts'

interface StoredAccount {
  email: string
  password: string
  name: string
}

interface AccountState {
  isLoggedIn: boolean
  isLoading: boolean
  displayName: string
  email: string
  avatarInitials: string
  authError: string | null
  signIn: (email: string, password: string) => Promise<void>
  createAccount: (name: string, email: string, password: string) => Promise<boolean>
  checkEmailExists: (email: string) => Promise<boolean>
  forgotPassword: (email: string, newPassword: string) => Promise<boolean>
  clearAuthError: () => void
  signOut: () => void
  updateProfile: (name: string) => void
}

async function getAccounts(): Promise<StoredAccount[]> {
  try {
    const raw = await AsyncStorage.getItem(ACCOUNTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

async function saveAccounts(accounts: StoredAccount[]): Promise<void> {
  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function makeInitials(name: string): string {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

export const useAccountStore = create<AccountState>((set) => ({
  isLoggedIn: false,
  isLoading: false,
  displayName: '',
  email: '',
  avatarInitials: '',
  authError: null,

  signIn: async (email, password) => {
    if (!email.trim() || !password) return
    set({ isLoading: true, authError: null })
    await new Promise<void>(resolve => setTimeout(resolve, 600))

    const accounts = await getAccounts()
    const account = accounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase())

    if (!account) {
      set({ isLoading: false, authError: 'No account found with this email. Please create an account first.' })
      return
    }

    if (account.password !== password) {
      set({ isLoading: false, authError: 'Incorrect password. Please try again.' })
      return
    }

    set({
      isLoggedIn: true,
      isLoading: false,
      displayName: account.name,
      email: account.email,
      avatarInitials: makeInitials(account.name),
      authError: null,
    })
  },

  createAccount: async (name, email, password) => {
    set({ isLoading: true, authError: null })
    await new Promise<void>(resolve => setTimeout(resolve, 600))

    const accounts = await getAccounts()
    const exists = accounts.some(a => a.email.toLowerCase() === email.trim().toLowerCase())

    if (exists) {
      set({ isLoading: false, authError: 'An account with this email already exists. Please sign in instead.' })
      return false
    }

    const newAccount: StoredAccount = { name: name.trim(), email: email.trim().toLowerCase(), password }
    await saveAccounts([...accounts, newAccount])

    set({
      isLoggedIn: true,
      isLoading: false,
      displayName: name.trim(),
      email: email.trim().toLowerCase(),
      avatarInitials: makeInitials(name.trim()),
      authError: null,
    })
    return true
  },

  checkEmailExists: async (email) => {
    const accounts = await getAccounts()
    return accounts.some(a => a.email.toLowerCase() === email.trim().toLowerCase())
  },

  forgotPassword: async (email, newPassword) => {
    const accounts = await getAccounts()
    const idx = accounts.findIndex(a => a.email.toLowerCase() === email.trim().toLowerCase())
    if (idx === -1) return false
    accounts[idx] = { ...accounts[idx], password: newPassword }
    await saveAccounts(accounts)
    return true
  },

  clearAuthError: () => set({ authError: null }),

  signOut: () => set({ isLoggedIn: false, displayName: '', email: '', avatarInitials: '', authError: null }),

  updateProfile: (name) => {
    set({ displayName: name, avatarInitials: makeInitials(name) })
  },
}))
