import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // feedback possible en mode invité
      index: true,
    },
    type: {
      type: String,
      enum: ["bug", "suggestion", "review", "other"],
      default: "other",
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 3000,
    },
    pageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "ignored"],
      default: "open",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    response: {
      type: String,
      trim: true,
      default: "",
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

// 🔹 Index combiné pour un tri rapide par statut et priorité
feedbackSchema.index({ status: 1, priority: 1, createdAt: -1 });

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
