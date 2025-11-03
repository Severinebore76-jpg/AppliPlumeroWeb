import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ReadingProgressSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, index: true },
    roman: { type: Types.ObjectId, ref: "Roman", required: true, index: true },
    currentChapter: { type: Types.ObjectId, ref: "Chapter", default: null },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    totalChapters: { type: Number, default: 0, min: 0 },
    lastReadAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false, index: true },
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

// Index unique : une seule progression par utilisateur et roman
ReadingProgressSchema.index({ user: 1, roman: 1 }, { unique: true });

// Query helpers
ReadingProgressSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

// Méthodes d’instance
ReadingProgressSchema.methods.updateProgress = async function (
  chapterNumber,
  totalChapters,
) {
  if (!totalChapters || totalChapters <= 0) return this;

  const percent = Math.min(
    100,
    Math.round((chapterNumber / totalChapters) * 100),
  );
  this.progressPercent = percent;
  this.totalChapters = totalChapters;
  this.lastReadAt = new Date();
  this.completed = percent >= 100;
  await this.save();
  return this;
};

// Méthodes statiques
ReadingProgressSchema.statics.resetProgress = async function (userId, romanId) {
  return this.updateOne(
    { user: userId, roman: romanId, isDeleted: false },
    {
      $set: {
        currentChapter: null,
        progressPercent: 0,
        completed: false,
        lastReadAt: new Date(),
      },
    },
  );
};

ReadingProgressSchema.statics.softDelete = async function (userId, romanId) {
  return this.updateOne(
    { user: userId, roman: romanId, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date() } },
  );
};

// Virtual : statut lisible
ReadingProgressSchema.virtual("status").get(function () {
  if (this.completed) return "Terminé";
  if (this.progressPercent === 0) return "Non commencé";
  return "En cours";
});

const ReadingProgress = model("ReadingProgress", ReadingProgressSchema);
export default ReadingProgress;
