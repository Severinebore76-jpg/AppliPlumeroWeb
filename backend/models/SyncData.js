import mongoose from "mongoose";

const syncDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dataType: {
      type: String,
      enum: [
        "reading_progress",
        "bookmarks",
        "preferences",
        "notifications",
        "settings",
      ],
      required: true,
      index: true,
    },
    dataPayload: {
      type: Object,
      required: true,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    deviceId: {
      type: String,
      default: "",
      index: true,
    },
    syncStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    errorLog: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// 🔹 Index combiné pour suivre les synchronisations par utilisateur, type et appareil
syncDataSchema.index({ user: 1, dataType: 1, deviceId: 1 });

// 🔹 Méthode : mise à jour du statut de synchronisation
syncDataSchema.methods.updateStatus = function (status, errorMessage = "") {
  this.syncStatus = status;
  this.errorLog = errorMessage;
  this.lastSyncedAt = new Date();
  return this.save();
};

const SyncData = mongoose.model("SyncData", syncDataSchema);
export default SyncData;
