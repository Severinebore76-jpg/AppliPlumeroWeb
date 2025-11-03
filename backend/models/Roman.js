// backend/models/Roman.js
// Modèle Roman — gestion des métadonnées, publication, stats, SEO, modération, soft-delete

import mongoose from "mongoose";
import slugify from "slugify";

const { Schema, model, Types } = mongoose;

/**
 * Constantes & enums
 */
export const ROMAN_STATUS = {
  DRAFT: "draft",
  REVIEW: "review",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

export const ROMAN_VISIBILITY = {
  PUBLIC: "public",
  PRIVATE: "private",
  UNLISTED: "unlisted",
};

export const ROMAN_LANG = ["fr", "en", "es"];

/**
 * Sous-documents
 */
const RatingSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, index: true },
    value: { type: Number, min: 1, max: 5, required: true },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } },
);

const SocialSchema = new Schema(
  {
    likes: { type: Number, default: 0, min: 0 },
    favorites: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const SeoSchema = new Schema(
  {
    title: { type: String, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 300 },
    keywords: [{ type: String, trim: true, lowercase: true }],
    canonicalUrl: { type: String, trim: true },
  },
  { _id: false },
);

/**
 * Schéma principal
 */
const RomanSchema = new Schema(
  {
    // Identité & auteur
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    author: { type: Types.ObjectId, ref: "User", required: true, index: true },

    // Contenu
    synopsis: { type: String, trim: true, maxlength: 5000 },
    summary: { type: String, trim: true, maxlength: 1000 }, // courte description
    genres: [{ type: String, trim: true, lowercase: true, index: true }],
    tags: [{ type: String, trim: true, lowercase: true, index: true }],
    language: { type: String, enum: ROMAN_LANG, default: "fr", index: true },
    coverImage: {
      url: { type: String, trim: true },
      blurhash: { type: String, trim: true },
      width: { type: Number, min: 1 },
      height: { type: Number, min: 1 },
    },

    // Publication & modération
    status: {
      type: String,
      enum: Object.values(ROMAN_STATUS),
      default: ROMAN_STATUS.DRAFT,
      index: true,
    },
    visibility: {
      type: String,
      enum: Object.values(ROMAN_VISIBILITY),
      default: ROMAN_VISIBILITY.PUBLIC,
      index: true,
    },
    publishedAt: { type: Date, index: true },
    lastChapterAt: { type: Date }, // MAJ lors de la publication d’un chapitre
    isFeatured: { type: Boolean, default: false, index: true },
    isAdultContent: { type: Boolean, default: false, index: true },
    moderation: {
      flagged: { type: Boolean, default: false, index: true },
      reason: { type: String, trim: true, maxlength: 500 },
      reviewedBy: { type: Types.ObjectId, ref: "User" },
      reviewedAt: { type: Date },
    },

    // Compteurs & stats
    stats: {
      views: { type: Number, default: 0, min: 0 },
      uniqueReaders: { type: Number, default: 0, min: 0 },
      commentsCount: { type: Number, default: 0, min: 0 },
      chaptersCount: { type: Number, default: 0, min: 0 },
      readingTimeMin: { type: Number, default: 0, min: 0 }, // estimation
    },

    // Social & ratings
    social: { type: SocialSchema, default: () => ({}) },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
      details: { type: [RatingSchema], default: [] }, // pour historique et doublons
    },

    // SEO
    seo: { type: SeoSchema, default: () => ({}) },

    // Soft delete
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
        // Hygiène de payload
        delete ret.isDeleted;
        delete ret.deletedAt;
        delete ret.deletedBy;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

/**
 * Indexes
 */
// Unicité slug par auteur pour permettre le même titre chez deux auteurs.
RomanSchema.index({ author: 1, slug: 1 }, { unique: true });

// Recherche textuelle de base (à optimiser si besoin via Atlas Search)
RomanSchema.index({ title: "text", synopsis: "text", tags: 1, genres: 1 });

/**
 * Virtuals
 */
RomanSchema.virtual("url").get(function () {
  return `/romans/${this._id}/${this.slug}`;
});

RomanSchema.virtual("ratingRounded").get(function () {
  return Math.round((this.ratings?.average || 0) * 10) / 10;
});

/**
 * Helpers internes
 */
function buildSlug(base) {
  return slugify(base, { lower: true, strict: true, trim: true });
}

async function ensureUniqueSlug(doc) {
  const base = buildSlug(doc.title || "");
  if (!base) return;

  // si le slug n’a pas changé, ne rien faire
  if (doc.slug && doc.isModified("title") === false) return;

  let slug = base;
  let i = 0;

  // Vérifie l’unicité par (author, slug)
  // On évite le full scan en filtrant par author.
  // Note: utilise this.constructor pour accéder au modèle.
  const Model = doc.constructor;

  // S’il s’agit d’un update où author change, on repart proprement
  const authorId = doc.author;

  // Boucle de collision
  while (
    await Model.exists({
      author: authorId,
      slug,
      _id: { $ne: doc._id },
    })
  ) {
    i += 1;
    slug = `${base}-${i}`;
  }

  doc.slug = slug;
}

/**
 * Middlewares
 */
RomanSchema.pre("validate", async function () {
  // Génère le slug si absent / titre modifié
  if (!this.slug || this.isModified("title") || this.isModified("author")) {
    await ensureUniqueSlug(this);
  }
});

RomanSchema.pre("save", function (next) {
  // publishedAt auto si on passe en publié et pas encore de date
  if (
    this.isModified("status") &&
    this.status === ROMAN_STATUS.PUBLISHED &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  // borne l’average proprement
  if (this.ratings && typeof this.ratings.average === "number") {
    this.ratings.average = Math.max(0, Math.min(5, this.ratings.average ?? 0));
  }
  next();
});

/**
 * Query helpers
 */
RomanSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

RomanSchema.query.published = function () {
  return this.where({ status: ROMAN_STATUS.PUBLISHED, isDeleted: false });
};

/**
 * Statics (méthodes de classe)
 */
RomanSchema.statics.findPublished = function (filter = {}, options = {}) {
  return this.find(
    { ...filter, status: ROMAN_STATUS.PUBLISHED, isDeleted: false },
    null,
    options,
  );
};

RomanSchema.statics.incrementViews = async function (
  romanId,
  { unique = false } = {},
) {
  // NOTE: la logique "unique" devrait se faire côté service via un cache (IP/user/day)
  const inc = { "stats.views": 1 };
  if (unique) inc["stats.uniqueReaders"] = 1;

  await this.updateOne({ _id: romanId, isDeleted: false }, { $inc: inc });
};

RomanSchema.statics.softDelete = async function (romanId, byUserId) {
  return this.updateOne(
    { _id: romanId, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date(), deletedBy: byUserId } },
  );
};

RomanSchema.statics.restore = async function (romanId) {
  return this.updateOne(
    { _id: romanId, isDeleted: true },
    { $set: { isDeleted: false }, $unset: { deletedAt: 1, deletedBy: 1 } },
  );
};

RomanSchema.statics.toggleFeatured = async function (romanId, value = true) {
  return this.updateOne(
    { _id: romanId, isDeleted: false },
    { $set: { isFeatured: !!value } },
  );
};

RomanSchema.statics.updateChaptersCount = async function (romanId, delta = 0) {
  const res = await this.findOneAndUpdate(
    { _id: romanId, isDeleted: false },
    { $inc: { "stats.chaptersCount": delta } },
    { new: true, projection: { "stats.chaptersCount": 1 } },
  );
  return res?.stats?.chaptersCount ?? 0;
};

RomanSchema.statics.bumpCommentsCount = async function (romanId, delta = 1) {
  const res = await this.findOneAndUpdate(
    { _id: romanId, isDeleted: false },
    { $inc: { "stats.commentsCount": delta } },
    { new: true, projection: { "stats.commentsCount": 1 } },
  );
  return res?.stats?.commentsCount ?? 0;
};

RomanSchema.statics.estimateReadingTime = function (textOrWordsCount) {
  // 200 mots/minute par défaut
  const WORDS_PER_MIN = 200;
  const words =
    typeof textOrWordsCount === "number"
      ? textOrWordsCount
      : String(textOrWordsCount || "")
          .trim()
          .split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MIN));
};

RomanSchema.statics.setReadingTime = async function (romanId, wordsCount) {
  const readingTimeMin = this.estimateReadingTime(wordsCount);
  await this.updateOne(
    { _id: romanId, isDeleted: false },
    { $set: { "stats.readingTimeMin": readingTimeMin } },
  );
  return readingTimeMin;
};

/**
 * Ratings — empêche les doublons, met à jour moyenne/compteur
 */
RomanSchema.methods.rate = async function (userId, value) {
  const val = Number(value);
  if (!(val >= 1 && val <= 5)) {
    throw new Error("Rating invalide: doit être entre 1 et 5.");
  }

  // Cherche un rating existant de l’utilisateur
  const idx = this.ratings.details.findIndex(
    (r) => r.user?.toString() === userId.toString(),
  );

  if (idx === -1) {
    // Nouveau vote
    this.ratings.details.push({ user: userId, value: val });
    const total = this.ratings.average * this.ratings.count + val;
    this.ratings.count += 1;
    this.ratings.average = total / this.ratings.count;
  } else {
    // Mise à jour du vote existant
    const prev = this.ratings.details[idx].value;
    this.ratings.details[idx].value = val;
    const total = this.ratings.average * this.ratings.count - prev + val;
    this.ratings.average = total / this.ratings.count;
  }

  // Clamp
  this.ratings.average = Math.max(0, Math.min(5, this.ratings.average));
  await this.save();
  return { average: this.ratings.average, count: this.ratings.count };
};

/**
 * Social
 */
RomanSchema.methods.like = async function () {
  this.social.likes += 1;
  await this.save();
  return this.social.likes;
};
RomanSchema.methods.unlike = async function () {
  this.social.likes = Math.max(0, this.social.likes - 1);
  await this.save();
  return this.social.likes;
};
RomanSchema.methods.favorite = async function () {
  this.social.favorites += 1;
  await this.save();
  return this.social.favorites;
};
RomanSchema.methods.unfavorite = async function () {
  this.social.favorites = Math.max(0, this.social.favorites - 1);
  await this.save();
  return this.social.favorites;
};

const Roman = model("Roman", RomanSchema);
export default Roman;
