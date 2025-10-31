import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    roman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roman",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    reported: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

// 🔹 Empêcher un utilisateur de noter plusieurs fois le même roman
ratingSchema.index({ roman: 1, user: 1 }, { unique: true });

// 🔹 Calcul automatique des moyennes (hook à utiliser plus tard côté service)
ratingSchema.statics.calculateAverage = async function (romanId) {
  const result = await this.aggregate([
    { $match: { roman: romanId } },
    {
      $group: {
        _id: "$roman",
        avgRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { avgRating: 0, totalRatings: 0 };
};

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;
