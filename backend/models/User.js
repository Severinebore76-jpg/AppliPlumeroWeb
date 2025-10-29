import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    isVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorCode: { type: String, select: false },
    avatarUrl: { type: String, default: "" },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Hash mot de passe avant save si modifié
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode d'instance pour comparer un mot de passe
userSchema.methods.matchPassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Nettoyage JSON (ne jamais exposer le hash)
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.twoFactorCode;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
