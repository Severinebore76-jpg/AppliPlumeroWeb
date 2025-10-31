import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["verify_email", "reset_password", "two_factor", "refresh"],
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    metadata: {
      ip: { type: String },
      userAgent: { type: String },
      createdFrom: { type: String }, // "web", "mobile", etc.
    },
  },
  { timestamps: true },
);

// 🔹 Index utile pour nettoyage automatique des tokens expirés
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// 🔹 Méthode utilitaire : vérifie la validité du token
tokenSchema.methods.isValid = function () {
  return !this.used && this.expiresAt > new Date();
};

// 🔹 Hook : log token invalidé si expiré
tokenSchema.pre("save", function (next) {
  if (this.isModified("used") && this.used === true) {
    this.metadata.invalidatedAt = new Date();
  }
  next();
});

const Token = mongoose.model("Token", tokenSchema);
export default Token;
