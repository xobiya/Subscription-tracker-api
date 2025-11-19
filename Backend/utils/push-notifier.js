export const sendPushNotification = async ({ to, subscription, daysBefore }) => {
  if (!to) {
    throw new Error('Push notification endpoint missing')
  }
  console.log('Push notification sent (simulated)', {
    to,
    subscription: subscription?.name,
    daysBefore,
  })
  return {
    delivered: true,
    message: `Simulated push delivered to ${to}`,
  }
}
