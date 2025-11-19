import NotificationLog from '../model/notificationLog.model.js'
import { sendReminderEmail } from '../utils/send-email.js'
import { sendSmsNotification } from '../utils/sms-notifier.js'
import { sendPushNotification } from '../utils/push-notifier.js'
import { formatReminderLabel } from '../config/notifications.js'

export const DISPATCH_CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
}

export const logNotification = async ({ user, subscription, channel, daysBefore }) => {
  const logEntry = await NotificationLog.create({
    user: user._id,
    subscription: subscription._id,
    channel,
    type: formatReminderLabel(daysBefore),
    daysBefore,
    scheduledAt: subscription.endDate || subscription.renewalDate,
    status: 'pending',
  })
  return logEntry
}

export const dispatchNotification = async ({ user, subscription, channel, daysBefore }) => {
  if (!user || !subscription) {
    throw new Error('User and subscription are required to send notifications')
  }

  const logEntry = await logNotification({ user, subscription, channel, daysBefore })
  let response = null
  try {
    if (channel === DISPATCH_CHANNELS.EMAIL) {
      response = await sendReminderEmail({
        to: user.email,
        subscription: { ...subscription, user },
        type: logEntry.type,
        daysBefore,
      })
    } else if (channel === DISPATCH_CHANNELS.SMS) {
      const smsNumber = user.notificationPreferences?.smsNumber || user.phone
      response = await sendSmsNotification({ to: smsNumber, subscription, daysBefore })
    } else if (channel === DISPATCH_CHANNELS.PUSH) {
      const pushEndpoint = user.notificationPreferences?.pushEndpoint
      response = await sendPushNotification({ to: pushEndpoint, subscription, daysBefore })
    } else {
      throw new Error(`Unsupported channel ${channel}`)
    }

    logEntry.status = 'sent'
    logEntry.sentAt = new Date()
    logEntry.response = response
    await logEntry.save()
    return logEntry
  } catch (error) {
    logEntry.status = 'failed'
    logEntry.error = error.message
    logEntry.sentAt = new Date()
    await logEntry.save()
    throw error
  }
}
