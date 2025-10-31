import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["free", "premium", "pro"],
      default: "free",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "canceled", "expired", "pending"],
      default: "pending",
      index: true,
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    renewalDate: { type: Date },
    paymentProvider: {
      type: String,
      enum: ["stripe", "paypal", "manual"],
      default: "stripe",
    },
    paymentRef: {
      type: String,
      default: "",
      trim: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "EUR",
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// 🔹 Index combiné pour gestion rapide des abonnements actifs
subscriptionSchema.index({ user: 1, status: 1, endDate: -1 });

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
