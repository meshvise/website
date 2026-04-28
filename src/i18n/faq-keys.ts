/**
 * Single source of truth for the FAQ list. Used both by the FAQ.astro
 * component (rendering) and Base.astro (FAQPage JSON-LD schema). Keep
 * the order here aligned with the user-facing reading flow.
 */
export const FAQ_KEYS = [
  'difference_niagara',
  'compatible_plc',
  'data_format',
  'powerbi',
  'self_host',
  'minimum_hardware',
  'security',
  'safety_sil',
  'open_source',
  'company_disappears',
  'multi_site',
  'wiresheet_status',
  'support',
  'trial',
] as const;

export type FAQKey = (typeof FAQ_KEYS)[number];
