import dayjs from 'dayjs'
import Subscription from '../model/subscription.model.js'
import NotificationLog from '../model/notificationLog.model.js'
import { dispatchNotification } from './notification.service.js'
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  normalizeChannels,
  normalizeDaysBefore,
  NOTIFICATION_CHANNELS,
} from '../config/notifications.js'

const { DISABLE_NOTIFICATION_SCHEDULER, NOTIFICATION_INTERVAL_MINUTES } = process.env
const intervalMs = (Number(NOTIFICATION_INTERVAL_MINUTES) || 60) * 60 * 1000
let schedulerHandle

export const runNotificationCycle = async () => {
  const now = dayjs().startOf('day')

  const subscriptions = await Subscription.find({
    status: 'active',
    endDate: { $gte: now.toDate() },
  }).populate('user')

  for (const subscription of subscriptions) {
    const user = subscription.user
    if (!user) continue

    const prefs = {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      ...user.notificationPreferences,
      channels: normalizeChannels(user.notificationPreferences?.channels),
      daysBefore: normalizeDaysBefore(user.notificationPreferences?.daysBefore),
    }

    if (!prefs.enabled) continue

    const daysUntil = dayjs(subscription.endDate).startOf('day').diff(now, 'day')
    if (daysUntil < 0) continue

    for (const channel of prefs.channels) {
      if (!NOTIFICATION_CHANNELS.includes(channel)) continue
      if (!prefs.daysBefore.includes(daysUntil)) continue

      const alreadySent = await NotificationLog.exists({
        user: user._id,
        subscription: subscription._id,
        channel,
        daysBefore: daysUntil,
        scheduledAt: subscription.endDate,
      })

      if (alreadySent) continue

      try {
        await dispatchNotification({ user, subscription, channel, daysBefore: daysUntil })
      } catch (error) {
        console.error('Notification dispatch failed', {
          user: user.email,
          subscription: subscription.name,
          channel,
          daysUntil,
          error: error.message,
        })
      }
    }
  }
}

export const setupNotificationScheduler = () => {
  if (DISABLE_NOTIFICATION_SCHEDULER === 'true') {
    console.info('Notification scheduler disabled via DISABLE_NOTIFICATION_SCHEDULER')
    return null
  }

  const runner = async () => {
    try {
      await runNotificationCycle()
    } catch (err) {
      console.error('Notification cycle failed', err)
    }
  }

  runner()
  schedulerHandle = setInterval(runner, intervalMs)
  console.info('Notification scheduler running every', intervalMs / 1000 / 60, 'minutes')

  return {
    stop: () => clearInterval(schedulerHandle),
  }
}
