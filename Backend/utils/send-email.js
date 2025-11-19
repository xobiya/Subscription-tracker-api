import { emailTemplates, generateEmailTemplate } from './email-template.js'
import dayjs from 'dayjs'
import transporter, { accountEmail } from '../config/nodemailer.js'
import { formatReminderLabel } from '../config/notifications.js'

const buildMailInfo = (subscription, options = {}) => {
  const renewalDate = dayjs(subscription?.endDate || subscription?.renewalDate || Date.now())
  const daysLeft = typeof options.daysBefore === 'number' ? options.daysBefore : Math.max(0, renewalDate.diff(dayjs(), 'day'))

  return {
    userName: subscription?.user?.name || 'Subscriber',
    subscriptionName: subscription?.name || 'Subscription',
    renewalDate: renewalDate.format('MMM D, YYYY'),
    planName: subscription?.name || 'Subscription',
    price: `${subscription?.currency || 'USD'} ${subscription?.price ?? '0'} (${subscription?.frequency || 'monthly'})`,
    paymentMethod: subscription?.paymentMethod || 'your preferred method',
    daysLeft,
    accountSettingsLink: options.accountSettingsLink || '#',
    supportLink: options.supportLink || '#',
  }
}

export const sendReminderEmail = async ({ to, type, subscription, daysBefore }) => {
  if (!to) throw new Error('Missing recipient email')

  const templateType = type || formatReminderLabel(daysBefore ?? 0)
  const template = emailTemplates.find((t) => t.label === templateType)
  const mailInfo = buildMailInfo(subscription, { daysBefore })

  const subject = template ? template.generateSubject(mailInfo) : `Reminder: ${mailInfo.subscriptionName} renews soon`
  const message = template ? template.generateBody(mailInfo) : generateEmailTemplate(mailInfo)

  const mailOptions = {
    from: accountEmail,
    to: to,
    subject,
    html: message,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Reminder email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Failed to send reminder email', error)
    throw error
  }
}