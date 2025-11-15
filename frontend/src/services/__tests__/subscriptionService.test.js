import { describe, it, expect, vi, beforeEach } from 'vitest'
import subscriptionService from '../subscriptionService'

vi.mock('../../api', () => ({
  default: {
    getSubscriptions: vi.fn(),
    createSubscription: vi.fn(),
    updateSubscription: vi.fn(),
    deleteSubscription: vi.fn(),
  }
}))

import api from '../../api'

describe('subscriptionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches subscriptions from backend and transforms fields', async () => {
    const fake = [{ _id: 'abc', name: 'Test', price: 12.5, startDate: '2024-01-01' }]
    api.getSubscriptions.mockResolvedValue({ success: true, data: fake })

    const res = await subscriptionService.fetchSubscriptions({ userId: 'u1', token: 't1' })
    expect(Array.isArray(res)).toBe(true)
    expect(res[0].id).toBe('abc')
    expect(res[0].name).toBe('Test')
    expect(res[0].price).toBeCloseTo(12.5)
    expect(res[0].startDate).toBe('2024-01-01')
  })

  it('falls back to mock data when no auth/options provided', async () => {
    // ensure backend not called
    api.getSubscriptions.mockResolvedValue({ success: false })
    const res = await subscriptionService.fetchSubscriptions()
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBeGreaterThanOrEqual(1)
    expect(res[0].name).toBeDefined()
  })
})
