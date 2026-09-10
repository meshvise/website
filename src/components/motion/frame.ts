/**
 * Le cadre commun des figures animées.
 *
 * Les six figures partagent une seule feuille de plan : mêmes marges, même
 * bandeau d'acte en haut, même cartouche en bas, même position pour les
 * voies et les cartes. Une figure qui s'écarte de ces valeurs le fait
 * exprès, pas par dérive.
 *
 * Le mouvement, lui, est décrit dans `motion.css` : quatre actes de durée
 * égale, joués au défilement quand le navigateur sait le faire, en boucle
 * temporelle sinon.
 */

/** Le format de toutes les figures. */
export const W = 720;
export const H = 520;

/** Bandeau d'acte : libellé à gauche, jauge de progression à droite. */
export const HEAD_BASE = 30; // ligne de base du libellé
export const HEAD_RULE = 44; // filet sous le bandeau
export const GAUGE_W = 108; // largeur totale de la jauge
export const GAUGE_H = 4;
export const GAUGE_Y = 22;

/** Aire de tracé. Les six figures y logent leur géométrie propre. */
export const X0 = 76;
export const X1 = 696;
export const Y0 = 74;
export const Y1 = 332;

/** Voies annexes : rubans de qualité, journaux d'alarmes, échelles. */
export const LANE_Y = 352;

/** Cartes de conclusion : ce que la supervision fait du fait. */
export const CARD_Y = 434;
export const CARD_H = 44;

/** Cartouche de plan. */
export const CART_RULE = 496;
export const CART_BASE = 512;

/** Bornes des quatre actes, en pourcentage du cycle. Partagées par toutes
 *  les figures : c'est ce qui donne au site un rythme unique au lieu de
 *  quatre cadences improvisées. */
export const ACTS = [0, 22, 48, 74, 100] as const;

/**
 * Cadrage. Renvoie la transformation qui amène le point (cx, cy) de l'espace
 * du dessin au centre de l'aire de tracé, agrandi k fois. Le groupe visé
 * porte `transform-box: view-box` et `transform-origin: 0 0`, donc le calcul
 * est exact et lisible plutôt que laissé à la boîte englobante.
 */
export function cam(
  cx: number,
  cy: number,
  k: number,
  ax: number = (X0 + X1) / 2,
  ay: number = (Y0 + Y1) / 2,
): string {
  const tx = ax - k * cx;
  const ty = ay - k * cy;
  return `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${k})`;
}

/** Le cadrage d'ensemble : aucun déplacement, aucun agrandissement. */
export const CAM_WIDE = 'translate(0px, 0px) scale(1)';

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

/** Millier séparé par une espace en français, par une virgule en anglais. */
export function thousands(v: number, lang: 'fr' | 'en'): string {
  return Math.round(v)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'fr' ? ' ' : ',');
}
