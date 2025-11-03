import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

export const MESSAGE_STATUS = {
  SENT: "sent",
  READ: "read",
  DELETED: "deleted",
};

const MessageSchema = new Schema(
  {
    sender: { type: Types.ObjectId, ref: "User", required: true, index: true },
    receiver: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    attachments: [
      {
        url: { type: String, trim: true },
        type: {
          type: String,
          enum: ["image", "audio", "file"],
          default: "file",
        },
        size: { type: Number, min: 0 },
      },
    ],
    status: {
      type: String,
      enum: Object.values(MESSAGE_STATUS),
      default: MESSAGE_STATUS.SENT,
      index: true,
    },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    isDeletedBySender: { type: Boolean, default: false, index: true },
    isDeletedByReceiver: { type: Boolean, default: false, index: true },
    isFlagged: { type: Boolean, default: false, index: true },
    flaggedReason: { type: String, trim: true, maxlength: 500 },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        // Nettoyage pour l’API publique
        delete ret.isDeletedBySender;
        delete ret.isDeletedByReceiver;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

// Index combiné pour retrouver les conversations entre deux utilisateurs
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

// Query helpers
MessageSchema.query.visibleToUser = function (userId) {
  return this.find({
    $or: [
      { sender: userId, isDeletedBySender: false },
      { receiver: userId, isDeletedByReceiver: false },
    ],
  });
};

// Méthodes d’instance
MessageSchema.methods.markAsRead = async function () {
  if (!this.isRead) {
    this.isRead = true;
    this.status = MESSAGE_STATUS.READ;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

MessageSchema.methods.softDeleteForUser = async function (userId) {
  if (this.sender.toString() === userId.toString()) {
    this.isDeletedBySender = true;
  }
  if (this.receiver.toString() === userId.toString()) {
    this.isDeletedByReceiver = true;
  }
  if (this.isDeletedBySender && this.isDeletedByReceiver) {
    this.status = MESSAGE_STATUS.DELETED;
  }
  await this.save();
  return this;
};

// Statics
MessageSchema.statics.getConversation = async function (
  userA,
  userB,
  limit = 50,
) {
  return this.find({
    $or: [
      { sender: userA, receiver: userB, isDeletedBySender: false },
      { sender: userB, receiver: userA, isDeletedByReceiver: false },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

const Message = model("Message", MessageSchema);
export default Message;
