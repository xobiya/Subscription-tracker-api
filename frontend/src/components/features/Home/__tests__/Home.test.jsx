import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import HomeView from '../HomeView'
import { AuthContext } from '../../../../contexts/AuthContext'

const sampleSubs = [
  { id: '1', name: 'Netflix', price: 15.99, frequency: 'monthly', category: 'Entertainment', paymentMethod: 'card' },
  { id: '2', name: 'Spotify', price: 9.99, frequency: 'monthly', category: 'Entertainment', paymentMethod: 'card' }
]

// We'll patch the real subscriptionService before importing the container in the integration test below.
// No module mocks required for the presentational HomeView test below.

describe('HomeView (presentational)', () => {
  it('renders counts, total and list items', () => {
    render(<HomeView userDisplayName="Alice" loading={false} error={null} subscriptions={sampleSubs} total={25.98} onRefresh={() => {}} />)

  expect(screen.getByText(/Welcome back, Alice/i)).toBeDefined()
  expect(screen.getByText(/Active subscriptions/i)).toBeDefined()
  expect(screen.getByText('2')).toBeDefined()
  expect(screen.getByText('$25.98')).toBeDefined()
    // check that each subscription name appears
  expect(screen.getByText('Netflix')).toBeDefined()
  expect(screen.getByText('Spotify')).toBeDefined()
  })
})

