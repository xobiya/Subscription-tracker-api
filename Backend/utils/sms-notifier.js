import https from 'node:https'
import { Buffer } from 'node:buffer'
import { URLSearchParams } from 'node:url'
import dayjs from 'dayjs'
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM } from '../config/env.js'

const buildMessageBody = (subscription, daysBefore) => {
  const renewalDate = dayjs(subscription?.endDate || Date.now()).format('MMM D, YYYY')
  return `Heads-up! Your subscription to ${subscription?.name || 'your service'} renews on ${renewalDate} (${daysBefore} day${daysBefore === 1 ? '' : 's'} away).`
}

const ensureTwilioConfig = () => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM) {
    throw new Error('Twilio credentials (SID/auth token/from) are not configured')
  }
}

export const sendSmsNotification = async ({ to, subscription, daysBefore }) => {
  ensureTwilioConfig()
  if (!to) throw new Error('SMS destination number is required')

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
  const payload = new URLSearchParams({
    To: to,
    From: TWILIO_FROM,
    Body: buildMessageBody(subscription, daysBefore ?? 0),
  }).toString()

  const authHeader = `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(json.message || 'Failed to send SMS'))
            return
          }
          resolve(json)
        } catch (error) {
          reject(error)
        }
      })
    })

    req.on('error', reject)
    req.write(payload)
    req.end()
  })
}
