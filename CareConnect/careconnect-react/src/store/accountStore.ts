import { create } from 'zustand'

interface AccountState {
  isLoggedIn: boolean
  isLoading: boolean
  displayName: string
  email: string
  avatarInitials: string
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  updateProfile: (name: string) => void
}

export const useAccountStore = create<AccountState>((set) => ({
  isLoggedIn: false,
  isLoading: false,
  displayName: '',
  email: '',
  avatarInitials: '',

  //Sign in  with email and password, simulating an async API call
  signIn: async (email, _password) => {
    set({ isLoading: true })
    await new Promise<void>(resolve => setTimeout(resolve, 1000))
    const rawName = email.split('@')[0].replace(/[._]/g, ' ')
    const displayName = rawName.replace(/\b\w/g, c => c.toUpperCase())
    const initials = displayName.split(' ').map(w => w[0]).slice(0, 2).join('')
    set({ isLoggedIn: true, isLoading: false, displayName, email, avatarInitials: initials })
  },

  signOut: () => set({ isLoggedIn: false, displayName: '', email: '', avatarInitials: '' }),

  updateProfile: (name) => {
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('')
    set({ displayName: name, avatarInitials: initials })
  },
}))
