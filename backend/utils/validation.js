// backend/utils/validation.js
// 🔹 Schémas Joi pour valider les données entrantes des routes API (Romans, Comments, Auth, Users)
import Joi from "joi";

// Roman
export const romanCreateSchema = Joi.object({
  title: Joi.string().min(2).max(180).required(),
  summary: Joi.string().allow(""),
  tags: Joi.array().items(Joi.string().max(40)).default([]),
  coverUrl: Joi.string().uri().allow(""),
  status: Joi.string().valid("draft", "published").default("draft"),
  visibility: Joi.string().valid("public", "private").default("public"),
  isFeatured: Joi.boolean().default(false),
  chapters: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        order: Joi.number().integer().min(0).default(0),
      })
    )
    .default([]),
});

export const romanUpdateSchema = romanCreateSchema.fork(["title"], (schema) =>
  schema.optional()
);

// Comment
export const commentCreateSchema = Joi.object({
  text: Joi.string().min(1).max(2000).required(),
});

export const commentUpdateSchema = Joi.object({
  text: Joi.string().min(1).max(2000),
  status: Joi.string().valid("pending", "approved", "rejected"), // admin
}).min(1);

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

export const updateMeSchema = Joi.object({
  name: Joi.string().min(2).max(80),
  avatarUrl: Joi.string().uri().allow("", null),
  password: Joi.string().min(8).max(128),
}).min(1);
