// Reminder email scheduled at iat + 144h (= 24h before trial expiry).
// Sober tone, single CTA: book a Calendly slot to discuss production.

const COPY = {
  fr: {
    subject: 'Votre essai Meshvise expire dans vingt-quatre heures',
    greeting: (name) => (name ? `Bonjour ${name},` : 'Bonjour,'),
    intro: 'Votre essai Meshvise expire dans vingt-quatre heures.',
    body: 'Pour passer en production, ou pour revenir sur ce que vous avez vu, trente minutes dans mon agenda suffisent.',
    cta: 'Réserver un créneau',
    fallback: 'Si vous préférez l\'écrit, répondez à ce courriel.',
    after: 'À l\'expiration, l\'application passera en lecture seule. Vos données restent accessibles, l\'export reste actif. Rien n\'est supprimé.',
    signoff: 'Bruno · Meshvise',
  },
  en: {
    subject: 'Your Meshvise trial expires in twenty-four hours',
    greeting: (name) => (name ? `Hello ${name},` : 'Hello,'),
    intro: 'Your Meshvise trial expires in twenty-four hours.',
    body: 'To move to production, or to go back over what you saw, thirty minutes in my calendar is enough.',
    cta: 'Book a slot',
    fallback: 'If you prefer writing, reply to this email.',
    after: 'On expiry, the application will switch to read-only. Your data stays accessible, export stays active. Nothing is deleted.',
    signoff: 'Bruno · Meshvise',
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

