import express from "express";
import { list, getOne, updateMe } from "../controllers/usersController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, requireRole("admin"), list);
router.get("/:id", protect, requireRole("admin"), getOne);
router.put("/me", protect, updateMe);

module.exports = router;
