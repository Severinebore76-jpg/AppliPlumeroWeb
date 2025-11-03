import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

export const SYNC_DIRECTION = {
  UPLOAD: "upload", // depuis le client vers le serveur
  DOWNLOAD: "download", // depuis le serveur vers le client
};

export const SYNC_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

const SyncDataSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, index: true },
    device: {
      type: Types.ObjectId,
      ref: "Device",
      required: true,
      index: true,
    },
    syncDirection: {
      type: String,
      enum: Object.values(SYNC_DIRECTION),
      required: true,
      default: SYNC_DIRECTION.UPLOAD,
      index: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function (v) {
          return v && Object.keys(v).length > 0;
        },
        message: "Payload vide non autorisé.",
      },
    },
    syncAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: Object.values(SYNC_STATUS),
      default: SYNC_STATUS.PENDING,
      index: true,
    },
    errorLog: { type: String, trim: true, maxlength: 1000 },
    retryCount: { type: Number, default: 0, min: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.isDeleted;
        delete ret.deletedAt;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

// Index combiné pour rechercher les dernières sync par utilisateur et appareil
SyncDataSchema.index({ user: 1, device: 1, syncAt: -1 });

// Query helpers
SyncDataSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

SyncDataSchema.query.successful = function () {
  return this.where({ status: SYNC_STATUS.SUCCESS });
};

// Méthodes d’instance
SyncDataSchema.methods.markSuccess = async function () {
  this.status = SYNC_STATUS.SUCCESS;
  this.retryCount = 0;
  await this.save();
  return this;
};

SyncDataSchema.methods.markFailed = async function (error) {
  this.status = SYNC_STATUS.FAILED;
  this.errorLog = error?.message || String(error);
  this.retryCount += 1;
  await this.save();
  return this;
};

// Méthodes statiques
SyncDataSchema.statics.softDelete = async function (syncId) {
  return this.updateOne(
    { _id: syncId, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date() } },
  );
};

// Virtual : résumé lisible
SyncDataSchema.virtual("summary").get(function () {
  return `[${this.syncDirection.toUpperCase()}] ${this.status} - ${this.syncAt.toLocaleString("fr-FR")}`;
});

const SyncData = model("SyncData", SyncDataSchema);
export default SyncData;
