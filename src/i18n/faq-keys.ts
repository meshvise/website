/**
 * Single source of truth for the FAQ list. Used by FAQ.astro to render
 * and by Base.astro to emit the FAQPage JSON-LD schema. Order = reading
 * flow on the page (spec docs/00-vision/vitrine.md, section FAQ).
 */
export const FAQ_KEYS = [
  'compatible',
  'format',
  'bi',
  'france',
  'hardware',
  'security',
  'audit',
  'sil',
  'disappear',
  'alone',
  'notfor',
  'multisite',
  'logic',
  'support',
  'trial_how',
  'demo_vs_trial',
] as const;

export type FAQKey = (typeof FAQ_KEYS)[number];
