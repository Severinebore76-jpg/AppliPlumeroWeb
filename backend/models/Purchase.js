import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    roman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roman",
      required: false, // null si abonnement global
      index: true,
    },
    type: {
      type: String,
      enum: ["single", "subscription", "token_pack"],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "EUR",
      uppercase: true,
      maxlength: 3,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "wallet", "free"],
      default: "stripe",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    transactionId: {
      type: String,
      default: "",
      index: true,
    },
    receiptUrl: {
      type: String,
      default: "",
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: null, // uniquement pour les abonnements
    },
  },
  { timestamps: true },
);

// 🔹 Index combiné utile pour filtrer par user / type / statut
purchaseSchema.index({ user: 1, type: 1, paymentStatus: 1 });

// 🔹 Méthode pour vérifier la validité d’un achat
purchaseSchema.methods.isActive = function () {
  if (this.type === "subscription" && this.expiresAt) {
    return this.paymentStatus === "succeeded" && this.expiresAt > new Date();
  }
  return this.paymentStatus === "succeeded";
};

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
