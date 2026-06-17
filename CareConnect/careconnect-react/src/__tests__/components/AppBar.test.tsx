import React from 'react'
import { Text } from 'react-native'
import { render, fireEvent } from '@testing-library/react-native'
import AppBar from '../../components/AppBar'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native')
  const Icon = () => <View testID="arrow-left-icon" />
  return { ArrowLeft: Icon }
})

describe('AppBar', () => {
  describe('title rendering', () => {
    it('renders the provided title text', () => {
      const { getByText } = render(<AppBar title="My Screen" />)
      expect(getByText('My Screen')).toBeTruthy()
    })

    it('renders a different title correctly', () => {
      const { getByText } = render(<AppBar title="Health Metrics" />)
      expect(getByText('Health Metrics')).toBeTruthy()
    })
  })

  describe('back button', () => {
    it('does not render back button when onBack is not provided', () => {
      const { queryByText } = render(<AppBar title="Title" />)
      expect(queryByText('Back')).toBeNull()
    })

    it('renders default "Back" label when onBack is provided', () => {
      const { getByText } = render(<AppBar title="Title" onBack={() => {}} />)
      expect(getByText('Back')).toBeTruthy()
    })

    it('renders a custom backLabel when provided', () => {
      const { getByText } = render(
        <AppBar title="Title" onBack={() => {}} backLabel="Settings" />
      )
      expect(getByText('Settings')).toBeTruthy()
    })

    it('calls onBack when the back button is pressed', () => {
      const onBack = jest.fn()
      const { getByText } = render(<AppBar title="Title" onBack={onBack} />)
      fireEvent.press(getByText('Back'))
      expect(onBack).toHaveBeenCalledTimes(1)
    })

    it('does not render custom backLabel when onBack is absent', () => {
      const { queryByText } = render(<AppBar title="Title" backLabel="Go Back" />)
      expect(queryByText('Go Back')).toBeNull()
    })
  })

  describe('actions slot', () => {
    it('renders action elements when provided', () => {
      const { getByText } = render(
        <AppBar title="Title" actions={<Text>Save</Text>} />
      )
      expect(getByText('Save')).toBeTruthy()
    })

    it('renders nothing in action area when actions is not provided', () => {
      const { queryByText } = render(<AppBar title="Title" />)
      expect(queryByText('Save')).toBeNull()
    })
  })
})
