// Subscription service: bridges UI/hooks to backend `src/api.js` and normalizes data.
import api from '../api'

const MOCK_SUBSCRIPTIONS = [
  { _id: '1', name: 'Netflix', price: 15.99, currency: '$', frequency: 'monthly', category: 'Entertainment', endDate: '2024-02-15' },
  { _id: '2', name: 'Spotify', price: 9.99, currency: '$', frequency: 'monthly', category: 'Entertainment', endDate: '2024-02-20' },
  { _id: '3', name: 'Adobe Creative', price: 52.99, currency: '$', frequency: 'monthly', category: 'Productivity', endDate: '2024-02-28' },
  { _id: '4', name: 'Amazon Prime', price: 14.99, currency: '$', frequency: 'monthly', category: 'Shopping', endDate: '2024-03-05' },
  { _id: '5', name: 'Microsoft 365', price: 6.99, currency: '$', frequency: 'monthly', category: 'Productivity', endDate: '2024-03-10' },
];

const transform = (raw) => ({
  id: raw._id || raw.id,
  name: raw.name,
  price: Number(raw.price || 0),
  currency: raw.currency || '$',
  frequency: raw.frequency || 'monthly',
  category: raw.category || 'Uncategorized',
  startDate: raw.startDate || raw.start_date || null,
  endDate: raw.endDate ? raw.endDate : raw.end_date ? raw.end_date : null,
  raw,
});

const subscriptionService = {
  /**
   * Fetch subscriptions for the provided userId/token. If opts are not provided or backend fails,
   * the function will fall back to returning mock data so the UI remains functional during refactor.
   * @param {object} opts { userId, token }
   */
  async fetchSubscriptions(opts = {}) {
    const { userId, token } = opts || {}

    if (userId && token) {
      const res = await api.getSubscriptions(userId, token)
      if (res && res.success && Array.isArray(res.data)) {
        return res.data.map(transform)
      }
      console.warn('subscriptionService.fetchSubscriptions: backend error', res)
    }

    // fallback: return mock data
    await new Promise((r) => setTimeout(r, 300))
    return MOCK_SUBSCRIPTIONS.map(transform)
  },

  async createSubscription(payload, opts = {}) {
    const { token } = opts || {}
    // Normalize payload to match backend expectations
    const normalize = (p) => ({
      ...p,
      currency: p.currency ? String(p.currency).toUpperCase() : 'USD',
      category: p.category ? String(p.category).toLowerCase() : 'other',
      frequency: p.frequency ? String(p.frequency).toLowerCase() : 'monthly',
      paymentMethod: p.paymentMethod ? String(p.paymentMethod).toLowerCase() : 'other',
      startDate: p.startDate ? (typeof p.startDate === 'string' ? p.startDate : new Date(p.startDate).toISOString()) : new Date().toISOString(),
    })

    const payloadToSend = normalize(payload)

    if (token) {
      const res = await api.createSubscription(payloadToSend, token)
      if (res && res.success) {
        const created = res.data?.subscription ?? res.data
        if (!created) throw new Error('Empty subscription returned from server')
        return transform(created)
      }
      throw new Error(res?.message || 'Failed to create subscription')
    }

    // If no token provided, still attempt to call API (api.request auto-reads token from localStorage)
    const res = await api.createSubscription(payloadToSend)
    if (res && res.success) {
      const created = res.data?.subscription ?? res.data
      if (!created) throw new Error('Empty subscription returned from server')
      return transform(created)
    }
    // fallback mock (kept for dev convenience)
    const mock = { _id: String(Date.now()), ...payload }
    return transform(mock)
  },

  async updateSubscription(id, payload, opts = {}) {
    const { token } = opts || {}
    if (token) {
      const res = await api.updateSubscription(id, payload, token)
      if (res && res.success) {
        const updated = res.data?.subscription ?? res.data
        if (!updated) throw new Error('Empty subscription returned from server')
        return transform(updated)
      }
      throw new Error(res?.message || 'Failed to update subscription')
    }
    return transform({ _id: id, ...payload })
  },

  async deleteSubscription(id, opts = {}) {
    const { token } = opts || {}
    if (token) {
      const res = await api.deleteSubscription(id, token)
      if (res && res.success) return { id }
      throw new Error(res?.message || 'Failed to delete subscription')
    }
    return { id }
  },
}

export default subscriptionService
