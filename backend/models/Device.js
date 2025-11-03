import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const DeviceSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, index: true },
    deviceId: { type: String, required: true, trim: true, unique: true },
    deviceName: { type: String, trim: true, maxlength: 100 },
    os: { type: String, trim: true, maxlength: 100 },
    browser: { type: String, trim: true, maxlength: 100 },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    refreshToken: { type: String, trim: true },
    lastLoginAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.refreshToken;
        delete ret.isDeleted;
        delete ret.deletedAt;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

// Index combiné : recherche rapide des appareils d’un utilisateur
DeviceSchema.index({ user: 1, active: 1 });

// Query helpers
DeviceSchema.query.active = function () {
  return this.where({ active: true, isDeleted: false });
};

DeviceSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

// Méthodes d’instance
DeviceSchema.methods.deactivate = async function () {
  this.active = false;
  await this.save();
  return this;
};

DeviceSchema.methods.refreshLogin = async function (ipAddress, userAgent) {
  this.lastLoginAt = new Date();
  if (ipAddress) this.ipAddress = ipAddress;
  if (userAgent) this.userAgent = userAgent;
  await this.save();
  return this;
};

// Méthodes statiques
DeviceSchema.statics.softDelete = async function (deviceId) {
  return this.updateOne(
    { deviceId, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date(), active: false } },
  );
};

DeviceSchema.statics.deactivateAllForUser = async function (userId) {
  return this.updateMany(
    { user: userId, active: true },
    { $set: { active: false } },
  );
};

// Virtual : résumé de session
DeviceSchema.virtual("sessionInfo").get(function () {
  return {
    name: this.deviceName || "Appareil inconnu",
    os: this.os || "—",
    browser: this.browser || "—",
    lastLogin: this.lastLoginAt,
    active: this.active,
  };
});

const Device = model("Device", DeviceSchema);
export default Device;
