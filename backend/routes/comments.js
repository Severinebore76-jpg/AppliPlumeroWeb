// backend/routes/comments.js
import express from "express";
import {
  createComment,
  getCommentsByRoman,
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  commentCreateSchema,
  commentUpdateSchema,
} from "../utils/validation.js";

const router = express.Router({ mergeParams: true });

// 🔹 Lecture publique
router.get("/", getCommentsByRoman);

// 🔹 Routes protégées
router.use(protect);
router.post("/", validateRequest(commentCreateSchema), createComment);
router.put("/:id", validateRequest(commentUpdateSchema), updateComment);
router.delete("/:id", deleteComment);

export default router;
