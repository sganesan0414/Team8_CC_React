import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import BottomNav from '../../components/BottomNav'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native')
  const Icon = () => <View />
  return { Home: Icon, Pill: Icon, Calendar: Icon, Bell: Icon, Users: Icon }
})

const TAB_LABELS = ['Home', 'Medications', 'Appointments', 'Reminders', 'Care Team']

describe('BottomNav', () => {
  describe('rendering', () => {
    it('renders all five tab labels', () => {
      const { getByText } = render(<BottomNav currentIndex={0} onTap={() => {}} />)
      TAB_LABELS.forEach(label => expect(getByText(label)).toBeTruthy())
    })
  })

  describe('active tab highlighting', () => {
    it('applies bold weight to the active tab label', () => {
      const { getByText } = render(<BottomNav currentIndex={0} onTap={() => {}} />)
      const homeLabel = getByText('Home')
      expect(homeLabel.props.style).toMatchObject({ fontWeight: '600' })
    })

    it('applies normal weight to inactive tab labels', () => {
      const { getByText } = render(<BottomNav currentIndex={0} onTap={() => {}} />)
      const medLabel = getByText('Medications')
      expect(medLabel.props.style).toMatchObject({ fontWeight: '400' })
    })

    it('marks the correct tab as active when currentIndex changes', () => {
      const { getByText } = render(<BottomNav currentIndex={2} onTap={() => {}} />)
      const apptLabel = getByText('Appointments')
      expect(apptLabel.props.style).toMatchObject({ fontWeight: '600' })
    })
  })

  describe('tab press callbacks', () => {
    it('calls onTap with index 0 when Home is pressed', () => {
      const onTap = jest.fn()
      const { getByText } = render(<BottomNav currentIndex={0} onTap={onTap} />)
      fireEvent.press(getByText('Home'))
      expect(onTap).toHaveBeenCalledWith(0)
    })

    it('calls onTap with index 1 when Medications is pressed', () => {
      const onTap = jest.fn()
      const { getByText } = render(<BottomNav currentIndex={0} onTap={onTap} />)
      fireEvent.press(getByText('Medications'))
      expect(onTap).toHaveBeenCalledWith(1)
    })

    it('calls onTap with index 2 when Appointments is pressed', () => {
      const onTap = jest.fn()
      const { getByText } = render(<BottomNav currentIndex={0} onTap={onTap} />)
      fireEvent.press(getByText('Appointments'))
      expect(onTap).toHaveBeenCalledWith(2)
    })

    it('calls onTap with index 3 when Reminders is pressed', () => {
      const onTap = jest.fn()
      const { getByText } = render(<BottomNav currentIndex={0} onTap={onTap} />)
      fireEvent.press(getByText('Reminders'))
      expect(onTap).toHaveBeenCalledWith(3)
    })

    it('calls onTap with index 4 when Care Team is pressed', () => {
      const onTap = jest.fn()
      const { getByText } = render(<BottomNav currentIndex={0} onTap={onTap} />)
      fireEvent.press(getByText('Care Team'))
      expect(onTap).toHaveBeenCalledWith(4)
    })
  })
})
