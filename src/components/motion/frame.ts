/**
 * Petits calculs partagés par les figures animées : longueur et écriture
 * d'une polyligne, décimale selon la langue. Le cadre commun des grandes
 * figures (feuille de plan, actes, cartouche) est parti avec elles le
 * 2026-09-23 : les bandes animées de l'accueil n'en avaient pas l'usage.
 */

/** Longueur d'une polyligne, pour la révéler par son propre trait. */
export function polylineLength(pts: Array<[number, number]>): number {
  let total = 0;
  for (let i = 1; i < pts.length; i += 1) {
    total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return total;
}

/** Écriture d'une liste de points en attribut `points`. */
export function toPoints(pts: Array<[number, number]>): string {
  return pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
}

/** Décimale à la française ou à l'anglaise, selon la langue de la page. */
export function decimal(v: number, n: number, lang: 'fr' | 'en'): string {
  return v.toFixed(n).replace('.', lang === 'fr' ? ',' : '.');
}
