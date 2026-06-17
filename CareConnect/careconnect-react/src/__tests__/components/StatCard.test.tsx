import React from 'react'
import { View } from 'react-native'
import { render } from '@testing-library/react-native'
import StatCard from '../../components/StatCard'
import type { LucideIcon } from 'lucide-react-native'

const MockIcon = (() => <View testID="stat-icon" />) as unknown as LucideIcon

describe('StatCard', () => {
  describe('content rendering', () => {
    it('renders the value text', () => {
      const { getByText } = render(
        <StatCard icon={MockIcon} iconColor="#1A3FB0" value="2/6" label="Medications Today" />
      )
      expect(getByText('2/6')).toBeTruthy()
    })

    it('renders the label text', () => {
      const { getByText } = render(
        <StatCard icon={MockIcon} iconColor="#1A3FB0" value="2/6" label="Medications Today" />
      )
      expect(getByText('Medications Today')).toBeTruthy()
    })

    it('renders the icon', () => {
      const { getByTestId } = render(
        <StatCard icon={MockIcon} iconColor="#1A3FB0" value="2/6" label="Medications Today" />
      )
      expect(getByTestId('stat-icon')).toBeTruthy()
    })

    it('renders different value and label correctly', () => {
      const { getByText } = render(
        <StatCard icon={MockIcon} iconColor="#2D7DD2" value="94%" label="Adherence Rate" />
      )
      expect(getByText('94%')).toBeTruthy()
      expect(getByText('Adherence Rate')).toBeTruthy()
    })
  })
})
