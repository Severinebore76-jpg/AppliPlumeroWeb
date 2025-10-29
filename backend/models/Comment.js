import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    roman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roman",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true,
    },
  },
  { timestamps: true }
);

commentSchema.index({ roman: 1, status: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
