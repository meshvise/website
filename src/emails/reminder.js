// Reminder email scheduled at iat + 144h (= 24h before trial expiry).
// Sober tone, single CTA: book a Calendly slot to discuss production.

const COPY = {
  fr: {
    subject: 'Plus que 24 heures sur votre essai Wiregrid',
    greeting: (name) => (name ? `Bonjour ${name},` : 'Bonjour,'),
    intro: 'Petit rappel : votre essai Wiregrid expire dans 24 heures.',
    body: 'Si vous voulez prolonger en production ou simplement échanger sur ce que vous avez vu, prenez 30 minutes dans mon agenda.',
    cta: 'Réserver un créneau',
    fallback: 'Si vous préférez l\'écrit, répondez simplement à cet email.',
    after: 'À l\'expiration, l\'app passera en lecture seule. Vos données restent accessibles, l\'export reste actif. Rien ne sera supprimé.',
    signoff: 'Bruno · Wiregrid',
  },
  en: {
    subject: 'Less than 24 hours left on your Wiregrid trial',
    greeting: (name) => (name ? `Hi ${name},` : 'Hi,'),
    intro: 'Quick reminder: your Wiregrid trial expires in 24 hours.',
    body: 'If you want to move to production or just chat about what you saw, grab 30 minutes on my calendar.',
    cta: 'Book a slot',
    fallback: 'If you prefer writing, just reply to this email.',
    after: 'On expiration, the app will switch to read-only. Your data stays accessible, export stays active. Nothing gets deleted.',
    signoff: 'Bruno · Wiregrid',
  },
};

export function renderReminderEmail({ lang, name, calendlyUrl }) {
  const c = COPY[lang === 'en' ? 'en' : 'fr'];
  const greeting = c.greeting(name);

  const html = `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0F172A;max-width:600px;margin:0 auto;padding:24px;line-height:1.55;">
  <p>${escapeHtml(greeting)}</p>
  <p>${c.intro}</p>
  <p>${c.body}</p>
  <p style="margin:24px 0;">
    <a href="${escapeAttr(calendlyUrl)}" style="display:inline-block;background:#0F172A;color:#FAFAF7;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:500;">${c.cta}</a>
  </p>
  <p style="color:#475569;">${c.fallback}</p>
  <p style="color:#475569;font-size:14px;margin-top:24px;">${c.after}</p>
  <p style="margin-top:24px;color:#475569;">${c.signoff}</p>
</body></html>`;

  const text = [
    c.intro,
    '',
    c.body,
    '',
    `${c.cta}: ${calendlyUrl}`,
    '',
    c.fallback,
    '',
    c.after,
    '',
    c.signoff,
  ].join('\n');

  return { subject: c.subject, html, text };
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
function escapeAttr(s) {
  return escapeHtml(s).replaceAll('"', '&quot;');
}
