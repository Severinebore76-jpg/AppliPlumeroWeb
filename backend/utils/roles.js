// ============================================
// 🔐 Fichier : roles.js
// ============================================
// Définition centralisée des rôles et permissions
// ============================================

export const ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
});

export const PERMISSIONS = Object.freeze({
  [ROLES.USER]: {
    canViewOwnProfile: true,
    canEditOwnProfile: true,
    canAccessAdminPanel: false,
  },
  [ROLES.ADMIN]: {
    canViewOwnProfile: true,
    canEditOwnProfile: true,
    canAccessAdminPanel: true,
    canManageUsers: true,
  },
});

/**
 * Vérifie si un rôle a une permission spécifique
 * @param {string} role - Rôle de l'utilisateur
 * @param {string} permission - Nom de la permission à vérifier
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  const perms = PERMISSIONS[role];
  return perms ? perms[permission] === true : false;
};
