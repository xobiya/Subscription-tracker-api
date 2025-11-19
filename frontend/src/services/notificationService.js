import api from '../api'

const DEFAULT_PREFERENCES = {
  enabled: true,
  channels: ['email'],
  daysBefore: [7, 5, 2, 1],
  smsNumber: '',
  pushEndpoint: '',
}

const normalize = (raw = {}) => ({
  enabled: typeof raw.enabled === 'boolean' ? raw.enabled : DEFAULT_PREFERENCES.enabled,
  channels: Array.isArray(raw.channels) && raw.channels.length ? raw.channels : DEFAULT_PREFERENCES.channels,
  daysBefore: Array.isArray(raw.daysBefore) && raw.daysBefore.length ? raw.daysBefore : DEFAULT_PREFERENCES.daysBefore,
  smsNumber: raw.smsNumber || DEFAULT_PREFERENCES.smsNumber,
  pushEndpoint: raw.pushEndpoint || DEFAULT_PREFERENCES.pushEndpoint,
})

const notificationService = {
  async getPreferences({ userId, token } = {}) {
    if (!userId || !token) return normalize()

    const res = await api.getNotificationPreferences(userId, token)
    if (res?.success && res.data?.notificationPreferences) {
      return normalize(res.data.notificationPreferences)
    }

    console.warn('notificationService.getPreferences: backend error', res)
    return normalize()
  },

  async updatePreferences({ userId, token, payload }) {
    if (!userId || !token) {
      throw new Error('Missing user or auth token while updating notification preferences')
    }

    const res = await api.updateNotificationPreferences(userId, payload, token)
    if (res?.success && res.data?.notificationPreferences) {
      return normalize(res.data.notificationPreferences)
    }

    throw new Error(res?.message || 'Failed to update notification preferences')
  },
}

export default notificationService
