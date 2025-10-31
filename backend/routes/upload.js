// backend/routes/upload.js
import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { uploadFile } from "../controllers/uploadController.js";

// 🔹 Configuration Multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Format de fichier non supporté"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

// 🔹 Route protégée — upload générique
router.post("/", protect, upload.single("file"), uploadFile);

export default router;
