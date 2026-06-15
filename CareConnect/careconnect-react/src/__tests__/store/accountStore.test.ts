import { useAccountStore } from '../../store/accountStore'

const initialState = useAccountStore.getState()

beforeEach(() => {
  useAccountStore.setState(initialState, true)
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('accountStore', () => {
  describe('initial state', () => {
    it('is not logged in by default', () => {
      expect(useAccountStore.getState().isLoggedIn).toBe(false)
    })

    it('is not loading by default', () => {
      expect(useAccountStore.getState().isLoading).toBe(false)
    })

    it('has empty displayName by default', () => {
      expect(useAccountStore.getState().displayName).toBe('')
    })

    it('has empty email by default', () => {
      expect(useAccountStore.getState().email).toBe('')
    })

    it('has empty avatarInitials by default', () => {
      expect(useAccountStore.getState().avatarInitials).toBe('')
    })
  })

  describe('signIn', () => {
    it('sets isLoading to true immediately on sign in', () => {
      const promise = useAccountStore.getState().signIn('john.doe@example.com', 'pass')
      expect(useAccountStore.getState().isLoading).toBe(true)
      jest.runAllTimers()
      return promise
    })

    it('sets isLoggedIn to true after signing in', async () => {
      const promise = useAccountStore.getState().signIn('john.doe@example.com', 'pass')
      jest.runAllTimers()
      await promise
      expect(useAccountStore.getState().isLoggedIn).toBe(true)
    })

    it('clears isLoading after signing in completes', async () => {
      const promise = useAccountStore.getState().signIn('john.doe@example.com', 'pass')
      jest.runAllTimers()
      await promise
      expect(useAccountStore.getState().isLoading).toBe(false)
    })

    it('stores the email after signing in', async () => {
      const promise = useAccountStore.getState().signIn('john.doe@example.com', 'pass')
      jest.runAllTimers()
      await promise
      expect(useAccountStore.getState().email).toBe('john.doe@example.com')
    })

    it('converts dot-separated email local part to title-case display name', async () => {
      const promise = useAccountStore.getState().signIn('john.doe@example.com', 'pass')
      jest.runAllTimers()
      await promise
      expect(useAccountStore.getState().displayName).toBe('John Doe')
    })

    it('converts underscore-separated email local part to title-case display name', async () => {
      const promise = useAccountStore.getState().signIn('jane_smith@example.com', 'pass')
      jest.runAllTimers()
      await promise
      expect(useAccountStore.getState().displayName).toBe('Jane Smith')
    })

    it('generates two-letter initials for a two-word display name', async () => {
      const promise = useAccountStore.getState().signIn('john.doe@example.com', 'pass')
      jest.runAllTimers()
      await promise
      expect(useAccountStore.getState().avatarInitials).toBe('JD')
    })

    it('generates one-letter initial for a single-word email local part', async () => {
      const promise = useAccountStore.getState().signIn('alice@example.com', 'pass')
      jest.runAllTimers()
      await promise
      expect(useAccountStore.getState().avatarInitials).toBe('A')
    })

    it('limits avatar initials to two characters for multi-word names', async () => {
      const promise = useAccountStore.getState().signIn('alice.bob.charlie@example.com', 'pass')
      jest.runAllTimers()
      await promise
      expect(useAccountStore.getState().avatarInitials).toBe('AB')
    })
  })

  describe('signOut', () => {
    beforeEach(async () => {
      const promise = useAccountStore.getState().signIn('john.doe@example.com', 'pass')
      jest.runAllTimers()
      await promise
    })

    it('sets isLoggedIn to false', () => {
      useAccountStore.getState().signOut()
      expect(useAccountStore.getState().isLoggedIn).toBe(false)
    })

    it('clears displayName', () => {
      useAccountStore.getState().signOut()
      expect(useAccountStore.getState().displayName).toBe('')
    })

    it('clears email', () => {
      useAccountStore.getState().signOut()
      expect(useAccountStore.getState().email).toBe('')
    })

    it('clears avatarInitials', () => {
      useAccountStore.getState().signOut()
      expect(useAccountStore.getState().avatarInitials).toBe('')
    })
  })

  describe('updateProfile', () => {
    it('updates displayName', () => {
      useAccountStore.getState().updateProfile('Alice Johnson')
      expect(useAccountStore.getState().displayName).toBe('Alice Johnson')
    })

    it('updates avatarInitials from the new name', () => {
      useAccountStore.getState().updateProfile('Alice Johnson')
      expect(useAccountStore.getState().avatarInitials).toBe('AJ')
    })

    it('limits avatarInitials to two characters for multi-word names', () => {
      useAccountStore.getState().updateProfile('Alice Bob Charlie')
      expect(useAccountStore.getState().avatarInitials).toBe('AB')
    })

    it('handles a single-word name', () => {
      useAccountStore.getState().updateProfile('Alice')
      expect(useAccountStore.getState().avatarInitials).toBe('A')
    })

    it('does not change isLoggedIn', () => {
      useAccountStore.getState().updateProfile('New Name')
      expect(useAccountStore.getState().isLoggedIn).toBe(false)
    })
  })
})
