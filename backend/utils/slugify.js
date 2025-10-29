import slugify from "slugify";

/**
 * Génère un slug propre et unique à partir d’un texte (titre, nom, etc.)
 * @param {string} text - Le texte source à transformer
 * @returns {string} - Slug formaté en minuscules et sans caractères spéciaux
 */
export default function generateSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}
