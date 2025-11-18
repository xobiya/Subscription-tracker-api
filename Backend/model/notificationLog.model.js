import mongoose from 'mongoose';
import { NOTIFICATION_CHANNELS } from '../config/notifications.js';

const notificationLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    channel: {
      type: String,
      enum: NOTIFICATION_CHANNELS,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      required: true,
      default: 'pending',
    },
    type: {
      type: String,
    },
    daysBefore: {
      type: Number,
    },
    scheduledAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
    },
    error: {
      type: String,
    },
  },
  { timestamps: true }
);

const NotificationLog = mongoose.model('NotificationLog', notificationLogSchema);
export default NotificationLog;
