export const NOTIFICATION_CHANNELS = ['email', 'sms', 'push'];
export const DEFAULT_NOTIFICATION_PREFERENCES = {
  enabled: true,
  channels: ['email'],
  daysBefore: [7, 5, 2, 1],
  smsNumber: '',
  pushEndpoint: '',
};
export const MAX_NOTIFICATION_DAY = 30;

export const normalizeChannels = (channels = []) => {
  const unique = new Set(Array.isArray(channels) ? channels : []);
  return Array.from(unique).filter((channel) => NOTIFICATION_CHANNELS.includes(channel));
};

export const normalizeDaysBefore = (values = []) => {
  const unique = new Set(Array.isArray(values) ? values : []);
  return Array.from(unique)
    .map((value) => Number(value))
    .filter((day) => Number.isFinite(day) && day >= 0 && day <= MAX_NOTIFICATION_DAY)
    .sort((a, b) => b - a);
};

export const formatReminderLabel = (daysBefore) => `${daysBefore} days before reminder`;
