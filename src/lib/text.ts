// Contour noir appliqué au texte blanc posé sur photo (titres et descriptions
// des heros). Les photos du parc sont très colorées : le drop-shadow seul ne
// suffisait pas, le contour garantit la lisibilité quelle que soit la zone.

export const TEXT_OUTLINE =
  "-1px -1px 0 rgba(0,0,0,0.85), 1px -1px 0 rgba(0,0,0,0.85), -1px 1px 0 rgba(0,0,0,0.85), 1px 1px 0 rgba(0,0,0,0.85)";

// Variante atténuée pour les textes secondaires (descriptions, mentions).
export const TEXT_OUTLINE_SOFT =
  "-1px -1px 0 rgba(0,0,0,0.55), 1px -1px 0 rgba(0,0,0,0.55), -1px 1px 0 rgba(0,0,0,0.55), 1px 1px 0 rgba(0,0,0,0.55)";

// Jaune des titres posés sur fond coloré (footer, bandeaux du site).
export const TITLE_YELLOW = "#FFD23F";

// Contour plus fin — pour le texte posé sur un aplat coloré (et non sur une
// photo) : le contour pleine épaisseur y mange les lettres les plus fines.
export const TEXT_OUTLINE_THIN =
  "-0.5px -0.5px 0 rgba(0,0,0,0.7), 0.5px -0.5px 0 rgba(0,0,0,0.7), -0.5px 0.5px 0 rgba(0,0,0,0.7), 0.5px 0.5px 0 rgba(0,0,0,0.7)";

export const TEXT_OUTLINE_THIN_SOFT =
  "-0.5px -0.5px 0 rgba(0,0,0,0.45), 0.5px -0.5px 0 rgba(0,0,0,0.45), -0.5px 0.5px 0 rgba(0,0,0,0.45), 0.5px 0.5px 0 rgba(0,0,0,0.45)";

// Les mots en dégradé utilisent `bg-clip-text` + `text-transparent` : le
// text-shadow hérité du titre se verrait *à travers* la lettre. On le neutralise
// donc. Pas de contour tracé ici : un WebkitTextStroke se peint par-dessus le
// remplissage et abîme le dégradé — ces mots restent lisibles sans.
export const GRADIENT_TEXT_NO_OUTLINE = { textShadow: "none" } as const;

// Typographie française : on colle un espace insécable avant la ponctuation
// haute (! ? : ;), avant l'euro et à l'intérieur des guillemets, pour éviter
// qu'un « ! » ou « € » orphelin ne tombe seul sur une nouvelle ligne (surtout
// en vue mobile où les lignes sont courtes).
export function fixOrphans(str: string): string {
  return str
    .replace(/ ([!?:;»%€])/g, " $1")
    .replace(/« /g, "« ");
}
