// backend/middleware/validateRequest.js
import Joi from "joi";

/**
 * 🧩 Middleware de validation des requêtes HTTP
 * @param {Joi.Schema} schema - Schéma Joi de validation
 * @param {"body" | "query" | "params"} property - Partie de la requête à valider
 */
export const validateRequest = (schema, property = "body") => {
  return (req, _res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const formatted = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message.replace(/['"]/g, ""),
      }));

      const err = new Error("Validation échouée");
      err.statusCode = 400;
      err.details = formatted;
      return next(err);
    }

    next();
  };
};
