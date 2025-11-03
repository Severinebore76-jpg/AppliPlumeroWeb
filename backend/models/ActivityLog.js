import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

export const ACTION_TYPES = {
  LOGIN: "login",
  LOGOUT: "logout",
  CREATE_ROMAN: "create_roman",
  UPDATE_ROMAN: "update_roman",
  DELETE_ROMAN: "delete_roman",
  COMMENT: "comment",
  LIKE_ROMAN: "like_roman",
  LIKE_COMMENT: "like_comment",
  RATE_ROMAN: "rate_roman",
  PROFILE_UPDATE: "profile_update",
  ADMIN_ACTION: "admin_action",
};

const ActivityLogSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, index: true },
    action: {
      type: String,
      enum: Object.values(ACTION_TYPES),
      required: true,
      index: true,
    },
    targetType: { type: String, trim: true, index: true },
    targetId: { type: Types.ObjectId, refPath: "targetType", index: true },
    metadata: { type: Schema.Types.Mixed, default: {} }, // contexte libre
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    success: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.isDeleted;
        delete ret.deletedAt;
        delete ret.deletedBy;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

// Index combiné : recherche rapide par utilisateur et action
ActivityLogSchema.index({ user: 1, action: 1, createdAt: -1 });

// Query helpers
ActivityLogSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

// Méthodes statiques
ActivityLogSchema.statics.log = async function ({
  user,
  action,
  targetType,
  targetId,
  metadata = {},
  ipAddress,
  userAgent,
  success = true,
}) {
  return this.create({
    user,
    action,
    targetType,
    targetId,
    metadata,
    ipAddress,
    userAgent,
    success,
  });
};

ActivityLogSchema.statics.softDelete = async function (logId, byUserId) {
  return this.updateOne(
    { _id: logId, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date(), deletedBy: byUserId } },
  );
};

ActivityLogSchema.statics.restore = async function (logId) {
  return this.updateOne(
    { _id: logId, isDeleted: true },
    { $set: { isDeleted: false }, $unset: { deletedAt: 1, deletedBy: 1 } },
  );
};

// Virtual : résumé lisible de l’action
ActivityLogSchema.virtual("summary").get(function () {
  const date = this.createdAt?.toLocaleString("fr-FR") ?? "";
  return `[${date}] ${this.action} → ${this.targetType ?? "—"} (${this.success ? "✅" : "❌"})`;
});

const ActivityLog = model("ActivityLog", ActivityLogSchema);
export default ActivityLog;
