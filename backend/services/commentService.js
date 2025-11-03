import Comment from "../models/Comment.js";
import Roman from "../models/Roman.js";
import { logActivity } from "../services/activityService.js";
import { romanService } from "../services/romanService.js";
import { sendNotification } from "../services/notificationService.js";

export const commentService = {
  // 🟢 Créer un commentaire ou une réponse
  async createComment(data, userId) {
    const { roman, content, parentId } = data;

    if (!content?.trim())
      throw new Error("Le contenu du commentaire est requis.");
    const romanExists = await Roman.findById(roman);
    if (!romanExists || romanExists.isDeleted)
      throw new Error("Roman introuvable.");

    const comment = await Comment.create({
      roman,
      author: userId,
      content: content.trim(),
      parentId: parentId || null,
    });

    // Log + notification + stats
    await logActivity(userId, "create_comment", comment._id, "Comment", true);
    if (parentId) {
      const parent = await Comment.findById(parentId);
      if (parent && parent.author.toString() !== userId.toString()) {
        await sendNotification({
          user: parent.author,
          type: "comment_reply",
          message: "Nouvelle réponse à votre commentaire.",
          relatedId: comment._id,
        });
      }
    } else {
      if (romanExists.author.toString() !== userId.toString()) {
        await sendNotification({
          user: romanExists.author,
          type: "new_comment",
          message: "Un nouveau commentaire a été ajouté à votre roman.",
          relatedId: comment._id,
        });
      }
    }

    await romanService.refreshStats(roman);
    return comment;
  },

  // 🔵 Récupérer tous les commentaires d’un roman
  async getCommentsByRoman(romanId, limit = 50) {
    const comments = await Comment.find({ roman: romanId, isDeleted: false })
      .populate("author", "username avatarUrl")
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();

    const map = new Map();
    const roots = [];

    comments.forEach((c) => {
      c.replies = [];
      map.set(c._id.toString(), c);
    });

    comments.forEach((c) => {
      if (c.parentId) {
        const parent = map.get(c.parentId.toString());
        if (parent) parent.replies.push(c);
      } else {
        roots.push(c);
      }
    });

    return roots;
  },

  // 🟠 Modifier un commentaire
  async updateComment(commentId, userId, updates) {
    const comment = await Comment.findById(commentId);
    if (!comment || comment.isDeleted)
      throw new Error("Commentaire introuvable.");
    if (comment.author.toString() !== userId.toString())
      throw new Error("Non autorisé à modifier ce commentaire.");

    comment.content = updates.content?.trim() || comment.content;
    comment.updatedAt = new Date();
    await comment.save();

    await logActivity(userId, "update_comment", commentId, "Comment", true);
    return comment;
  },

  // 🔴 Supprimer un commentaire (soft delete)
  async deleteComment(commentId, userId) {
    const comment = await Comment.findById(commentId);
    if (!comment || comment.isDeleted)
      throw new Error("Commentaire introuvable.");
    if (comment.author.toString() !== userId.toString())
      throw new Error("Non autorisé à supprimer ce commentaire.");

    comment.isDeleted = true;
    comment.deletedAt = new Date();
    comment.deletedBy = userId;
    await comment.save();

    await logActivity(userId, "delete_comment", commentId, "Comment", true);
    await romanService.refreshStats(comment.roman);
    return comment;
  },

  // ⚙️ Modération
  async flagComment(commentId, userId, reason) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Commentaire introuvable.");

    comment.flagged = true;
    comment.flaggedReason = reason || "Non précisé";
    comment.status = "flagged";
    await comment.save();

    await logActivity(userId, "flag_comment", commentId, "Comment", true);
    return comment;
  },

  // 📊 Compter les commentaires actifs d’un roman
  async countComments(romanId) {
    return Comment.countDocuments({ roman: romanId, isDeleted: false });
  },
};
