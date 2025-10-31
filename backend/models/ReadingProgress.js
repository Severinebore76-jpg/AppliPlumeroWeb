import mongoose from "mongoose";

const readingProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    roman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roman",
      required: true,
      index: true,
    },
    currentChapter: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalChapters: {
      type: Number,
      default: 0,
      min: 0,
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

// 🔹 Empêcher plusieurs entrées pour un même roman/user
readingProgressSchema.index({ user: 1, roman: 1 }, { unique: true });

// 🔹 Méthode pour mise à jour automatique de la progression
readingProgressSchema.methods.updateProgress = function (chapterIndex) {
  if (this.totalChapters > 0) {
    this.currentChapter = chapterIndex;
    this.progressPercent = Math.round(
      (chapterIndex / this.totalChapters) * 100,
    );
    this.completed = this.progressPercent >= 100;
    this.lastReadAt = new Date();
  }
  return this.save();
};

const ReadingProgress = mongoose.model(
  "ReadingProgress",
  readingProgressSchema,
);
export default ReadingProgress;
