import User from '../model/user.model.js'
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  normalizeChannels,
  normalizeDaysBefore,
} from '../config/notifications.js'

const sanitizePreferences = (base = {}, updates = {}) => {
  const channels = normalizeChannels(updates.channels ?? base.channels)
  const daysBefore = normalizeDaysBefore(updates.daysBefore ?? base.daysBefore)

  return {
    enabled: typeof updates.enabled === 'boolean' ? updates.enabled : base.enabled ?? DEFAULT_NOTIFICATION_PREFERENCES.enabled,
    channels: channels.length ? channels : base.channels ?? DEFAULT_NOTIFICATION_PREFERENCES.channels,
    daysBefore: daysBefore.length ? daysBefore : base.daysBefore ?? DEFAULT_NOTIFICATION_PREFERENCES.daysBefore,
    smsNumber: updates.smsNumber ?? base.smsNumber ?? DEFAULT_NOTIFICATION_PREFERENCES.smsNumber,
    pushEndpoint: updates.pushEndpoint ?? base.pushEndpoint ?? DEFAULT_NOTIFICATION_PREFERENCES.pushEndpoint,
    timezone: updates.timezone ?? base.timezone ?? DEFAULT_NOTIFICATION_PREFERENCES.timezone,
  }
}

export const getNotificationPreferences = async (req, res, next) => {
  try {
    const { id } = req.params
    if (req.user._id.toString() !== id.toString()) {
      const error = new Error('Not authorized to view these preferences')
      error.statusCode = 401
      throw error
    }

    const preferences = req.user.notificationPreferences || DEFAULT_NOTIFICATION_PREFERENCES
    res.status(200).json({ success: true, data: { notificationPreferences: preferences } })
  } catch (error) {
    next(error)
  }
}

export const updateNotificationPreferences = async (req, res, next) => {
  try {
    const { id } = req.params
    if (req.user._id.toString() !== id.toString()) {
      const error = new Error('Not authorized to update these preferences')
      error.statusCode = 401
      throw error
    }

    const sanitized = sanitizePreferences(req.user.notificationPreferences, req.body)
    req.user.notificationPreferences = sanitized
    await req.user.save()

    res.status(200).json({ success: true, data: { notificationPreferences: sanitized, user: req.user } })
  } catch (error) {
    next(error)
  }
}
