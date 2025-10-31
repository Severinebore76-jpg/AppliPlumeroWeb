import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    type: {
      type: String,
      enum: ["text", "system", "alert"],
      default: "text",
    },
    attachments: [
      {
        url: { type: String, trim: true },
        fileType: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true },
);

// 🔹 Index combiné : conversations récentes et messages non lus
messageSchema.index({ receiver: 1, read: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
