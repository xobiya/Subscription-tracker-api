import mongoose from "mongoose";
import { DEFAULT_NOTIFICATION_PREFERENCES, NOTIFICATION_CHANNELS } from "../config/notifications.js";

const notificationPreferencesSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: DEFAULT_NOTIFICATION_PREFERENCES.enabled },
    channels: {
      type: [String],
      default: () => [...DEFAULT_NOTIFICATION_PREFERENCES.channels],
      enum: NOTIFICATION_CHANNELS,
    },
    daysBefore: {
      type: [Number],
      default: () => [...DEFAULT_NOTIFICATION_PREFERENCES.daysBefore],
    },
    smsNumber: { type: String, trim: true, default: DEFAULT_NOTIFICATION_PREFERENCES.smsNumber },
    pushEndpoint: { type: String, trim: true, default: DEFAULT_NOTIFICATION_PREFERENCES.pushEndpoint },
    timezone: { type: String, trim: true, default: 'UTC' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    notificationPreferences: {
      type: notificationPreferencesSchema,
      default: () => ({ ...DEFAULT_NOTIFICATION_PREFERENCES }),
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

// {name:"Feleke Eshetu", email:"feleke@example.com", password:"password123"}