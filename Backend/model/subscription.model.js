import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Subscription name is required"],
    trim: true,
    minLength: 2,
    maxLength: 100
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  currency: {
    type: String,
    required: [true, "Currency is required"],
    trim: true,
    uppercase: true,
    enum: ["USD", "EUR", "GBP", "JPY", "ETB"]
  },
  frequency: {
    type: String,
    required: [true, "Billing cycle is required"],
    trim: true,
    enum: ["daily", "weekly", "monthly", "yearly"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
    enum: ["entertainment", "productivity", "education", "health", "other"]
  },
  paymentMethod: {
    type: String,
    required: [true, "Payment method is required"],
    trim: true,
    enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "other"]
  },
  status: {
    type: String,
    required: [true, "Status is required"],
    trim: true,
    default: "active",
    enum: ["active", "inactive", "canceled", "paused", "expired"]
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"]
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

subscriptionSchema.pre('save', function(next) {
  if (!this.endDate) {
    const endPeriods = { daily: 1, weekly: 7, monthly: 30, yearly: 365 };
    const daysToAdd = endPeriods[this.frequency] || 30;
    this.endDate = new Date(this.startDate);
    this.endDate.setDate(this.endDate.getDate() + daysToAdd);
  }

  // auto-update status based on endDate
  if (this.endDate < new Date()) {
    this.status = 'expired';
  }
  
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
// {name:"Netflix", price:9.99, currency:"USD", frequency:"monthly", category:"entertainment", paymentMethod:"credit_card", status:"active", startDate:"2023-01-01", user:"64a7f0c2e1b8c2a5d6f4e8b9"}