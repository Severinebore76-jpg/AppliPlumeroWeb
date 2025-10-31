import mongoose from "mongoose";

const bookStatsSchema = new mongoose.Schema(
  {
    roman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roman",
      required: true,
      index: true,
    },
    views: { type: Number, default: 0 },
    uniqueReaders: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    avgReadingTime: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    lastReadAt: { type: Date, default: null },
    trendingScore: { type: Number, default: 0 },
    dailyViews: [
      {
        date: { type: Date, default: Date.now },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true },
);

bookStatsSchema.index({ roman: 1 });
bookStatsSchema.index({ trendingScore: -1 });
bookStatsSchema.index({ "dailyViews.date": -1 });

bookStatsSchema.methods.updateTrendingScore = function () {
  const activityWeight = this.views + this.likes * 2 + this.bookmarks * 3;
  this.trendingScore = Math.round(activityWeight / 10);
  return this.save();
};

const BookStats = mongoose.model("BookStats", bookStatsSchema);
export default BookStats;
