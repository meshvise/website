/**
 * Les questions de la FAQ, dans l'ordre de lecture. Depuis le 2026-09-23, la
 * FAQ n'a plus de page à elle : elle vit sur la page Tarifs, réduite aux
 * questions d'un acheteur. Source unique pour FAQ.astro et pour le balisage
 * FAQPage de Base.astro, qui n'est émis que sur la page qui les affiche.
 */
export const FAQ_KEYS = [
  'trial_how',
  'demo_vs_trial',
  'hardware',
  'support',
  'updates',
  'disappear',
  'notfor',
] as const;

export type FAQKey = (typeof FAQ_KEYS)[number];
