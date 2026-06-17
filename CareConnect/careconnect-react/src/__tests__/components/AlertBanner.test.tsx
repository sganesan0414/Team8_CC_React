import React from 'react'
import { View } from 'react-native'
import { render, fireEvent } from '@testing-library/react-native'
import AlertBanner from '../../components/AlertBanner'
import type { LucideIcon } from 'lucide-react-native'

const MockIcon = (() => <View testID="banner-icon" />) as unknown as LucideIcon

describe('AlertBanner', () => {
  describe('content rendering', () => {
    it('renders the title text', () => {
      const { getByText } = render(
        <AlertBanner icon={MockIcon} title="Refill Reminder" body="You are running low." />
      )
      expect(getByText('Refill Reminder')).toBeTruthy()
    })

    it('renders the body text', () => {
      const { getByText } = render(
        <AlertBanner icon={MockIcon} title="Alert" body="Please take your medication." />
      )
      expect(getByText('Please take your medication.')).toBeTruthy()
    })

    it('renders the icon', () => {
      const { getByTestId } = render(
        <AlertBanner icon={MockIcon} title="Alert" body="Body" />
      )
      expect(getByTestId('banner-icon')).toBeTruthy()
    })
  })

  describe('action button', () => {
    it('renders action button when actionLabel and onAction are provided', () => {
      const { getByText } = render(
        <AlertBanner
          icon={MockIcon}
          title="Alert"
          body="Body"
          actionLabel="Request Refill"
          onAction={() => {}}
        />
      )
      expect(getByText('Request Refill →')).toBeTruthy()
    })

    it('does not render action button when actionLabel is missing', () => {
      const { queryByText } = render(
        <AlertBanner icon={MockIcon} title="Alert" body="Body" onAction={() => {}} />
      )
      expect(queryByText(/→/)).toBeNull()
    })

    it('does not render action button when onAction is missing', () => {
      const { queryByText } = render(
        <AlertBanner icon={MockIcon} title="Alert" body="Body" actionLabel="Request Refill" />
      )
      expect(queryByText(/→/)).toBeNull()
    })

    it('calls onAction when the action button is pressed', () => {
      const onAction = jest.fn()
      const { getByText } = render(
        <AlertBanner
          icon={MockIcon}
          title="Alert"
          body="Body"
          actionLabel="Request Refill"
          onAction={onAction}
        />
      )
      fireEvent.press(getByText('Request Refill →'))
      expect(onAction).toHaveBeenCalledTimes(1)
    })
  })
})
