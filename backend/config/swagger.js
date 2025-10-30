/**
 * 📘 Configuration Swagger (OpenAPI) — AppliPlumeroWeb
 * ---------------------------------------------------
 * Génère une documentation interactive de l'API accessible via /api-docs
 */

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "📚 API — AppliPlumeroWeb",
      version: "1.0.0",
      description:
        "Documentation officielle de l’API Plumero. Permet de tester les endpoints d’authentification, romans, commentaires et utilisateurs.",
      contact: {
        name: "Séverine Boré",
        email: "contact@plumero.com",
        url: "https://plumero.com",
      },
    },
    servers: [
      { url: "http://localhost:8080", description: "Développement local" },
      { url: "https://api.plumero.com", description: "Production" },
    ],
  },
  apis: ["./backend/routes/*.js", "./backend/models/*.js"], // fichiers analysés pour extraire les annotations Swagger
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Documentation Swagger disponible sur /api-docs");
};
