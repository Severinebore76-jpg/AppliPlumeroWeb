// ============================================
// 📁 backend/middleware/securityHeaders.js
// Sécurisation des en-têtes HTTP
// ============================================

import helmet from "helmet";

// Middleware combiné pour renforcer la sécurité HTTP
export const securityHeaders = (app) => {
  // Application des protections par défaut de Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // désactivé pour compatibilité avec React
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Ajout d'en-têtes supplémentaires personnalisés
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
    res.setHeader("Permissions-Policy", "geolocation=(), camera=()");
    next();
  });
};
