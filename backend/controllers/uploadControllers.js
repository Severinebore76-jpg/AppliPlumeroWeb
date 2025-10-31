import { uploadSingleFile } from "../services/uploadService.js";
import { createError } from "../utils/errorResponse.js";

// 📤 Upload d’un fichier unique (avatar, cover, etc.)
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) throw createError(400, "Aucun fichier fourni");

    const uploadedFile = await uploadSingleFile(req.file, req.user);
    res.status(201).json({
      success: true,
      message: "Fichier uploadé avec succès",
      file: uploadedFile,
    });
  } catch (err) {
    next(err);
  }
};

// 📦 Upload multiple (ex : galerie d’images)
export const uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0)
      throw createError(400, "Aucun fichier fourni");

    const results = await Promise.all(
      req.files.map((file) => uploadSingleFile(file, req.user)),
    );

    res.status(201).json({
      success: true,
      message: `${results.length} fichiers uploadés avec succès`,
      files: results,
    });
  } catch (err) {
    next(err);
  }
};
