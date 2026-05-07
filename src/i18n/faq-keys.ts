/**
 * Single source of truth for the FAQ list. Used by FAQ.astro to render
 * and by Base.astro to emit the FAQPage JSON-LD schema. Order = reading
 * flow on the page.
 */
export const FAQ_KEYS = [
  'compatible_plc',
  'data_format',
  'powerbi',
  'self_host',
  'sovereignty_data',
  'gdpr_compliance',
  'minimum_hardware',
  'security',
  'code_audit',
  'safety_sil',
  'company_disappears',
  'multi_site',
  'wiresheet_status',
  'support',
  'support_language',
  'trial',
  'demo_vs_trial',
  'trial_what_happens',
  'trial_end',
] as const;

export type FAQKey = (typeof FAQ_KEYS)[number];
