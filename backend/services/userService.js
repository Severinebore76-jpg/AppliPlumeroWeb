import User from "../models/User.js";

export const createUser = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error("Un utilisateur avec cet email existe déjà.");
    err.statusCode = 409;
    throw err;
  }
  const user = await User.create({ name, email, password });
  return user;
};

export const getByEmailWithPassword = (email) =>
  User.findOne({ email }).select("+password");

export const getById = (id) => User.findById(id);

export const listUsers = (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return User.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
};

export const updateUserMe = async (userId, data) => {
  const allowed = ["name", "avatarUrl", "password"];
  const toUpdate = {};
  for (const k of allowed) if (data[k] !== undefined) toUpdate[k] = data[k];

  const user = await User.findById(userId).select("+password");
  if (!user) {
    const err = new Error("Utilisateur introuvable");
    err.statusCode = 404;
    throw err;
  }

  if (toUpdate.name !== undefined) user.name = toUpdate.name;
  if (toUpdate.avatarUrl !== undefined) user.avatarUrl = toUpdate.avatarUrl;
  if (toUpdate.password !== undefined) user.password = toUpdate.password; // sera hashé par le pre('save')

  await user.save();
  return user;
};
