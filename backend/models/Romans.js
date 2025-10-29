import mongoose from "mongoose";
import slugify from "slugify";

const romanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
      maxlength: 180,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    coverUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    chapters: [
      {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true }, // Markdown ou HTML
        order: { type: Number, default: 0 },
      },
    ],
    stats: {
      reads: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      bookmarks: { type: Number, default: 0 },
    },
    isFeatured: { type: Boolean, default: false },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

// 🔹 Indexation pour recherche textuelle
romanSchema.index({ title: "text", summary: "text", tags: 1 });

// 🔹 Génération automatique du slug à partir du titre
romanSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// 🔹 Projection utile : renvoyer uniquement les champs essentiels en liste
romanSchema.statics.publicFields = function () {
  return "title slug author summary tags status coverUrl isFeatured visibility";
};

const Roman = mongoose.model("Roman", romanSchema);
export default Roman;
