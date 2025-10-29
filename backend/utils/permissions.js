// backend/utils/permissions.js
export const checkOwnershipOrAdmin = (resource, user) => {
  const isOwner = resource.author.toString() === user._id.toString();
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) {
    const err = new Error("Accès interdit");
    err.statusCode = 403;
    throw err;
  }
};
