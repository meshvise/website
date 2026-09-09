// Post-mortem email scheduled at iat + 170h (= 2h after trial expiry).
// Tone: curious, not pushy. Either help us improve or move forward.

const COPY = {
  fr: {
    subject: 'Votre essai Meshvise est terminé',
    greeting: (name) => (name ? `Bonjour ${name},` : 'Bonjour,'),
    intro: 'Votre essai s\'est terminé il y a quelques heures. L\'application est maintenant en lecture seule sur votre installation : vos données et votre configuration restent accessibles, les écritures sont bloquées.',
    body: 'Quelle que soit votre décision, votre retour compte. Si Meshvise répond à votre besoin, la licence de production prend le relais sur la même installation. Sinon, dites-moi ce qui a manqué : c\'est ce qui oriente la suite.',
    cta_book: 'Réserver quinze minutes',
    cta_email: 'Ou répondez à ce courriel avec ce que vous en avez retenu.',
    next_steps_title: 'Si vous voulez passer en production',
    next_steps: [
      'On-Premise, 2 400 € HT par an, points, machines et écrans sans limite.',
      'Reprise de votre installation d\'essai sans perte : une licence permanente remplace celle d\'essai, vous redémarrez la pile.',
      'Support par courriel, réponse sous deux jours ouvrés. Vos données restent sur votre serveur.',
    ],
    signoff: 'Bruno · Meshvise',
  },
  en: {
    subject: 'Your Meshvise trial has ended',
    greeting: (name) => (name ? `Hi ${name},` : 'Hi,'),
    intro: 'Your trial ended a couple of hours ago. The application on your install is now read-only: your data and configuration stay accessible, writes are blocked.',
    body: 'Whatever you decided, your feedback counts. If Meshvise fits your need, the production licence takes over on the same install. If it does not, tell me what was missing: that is what shapes the next version.',
    cta_book: 'Book fifteen minutes',
    cta_email: 'Or reply to this email with what you took away from it.',
    next_steps_title: 'If you want to move to production',
    next_steps: [
      'On-Premise, €2,400 excl. VAT per year, unlimited points, machines and screens.',
      'Carry over your trial install with no data loss: a permanent licence replaces the trial one, you restart the stack.',
      'Email support, answered within two business days. Your data stays on your server.',
    ],
    signoff: 'Bruno · Meshvise',
  },
};

export function renderPostMortemEmail({ lang, name, calendlyUrl }) {
  const c = COPY[lang === 'en' ? 'en' : 'fr'];
  const greeting = c.greeting(name);
  const stepsHtml = c.next_steps.map((s) => `<li>${s}</li>`).join('');

  const html = `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0F172A;max-width:600px;margin:0 auto;padding:24px;line-height:1.55;">
  <p>${escapeHtml(greeting)}</p>
  <p>${c.intro}</p>
  <p>${c.body}</p>
  <p style="margin:24px 0;">
    <a href="${escapeAttr(calendlyUrl)}" style="display:inline-block;background:#0F172A;color:#FAFAF7;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:500;">${c.cta_book}</a>
  </p>
  <p style="color:#475569;">${c.cta_email}</p>

  <h2 style="font-size:16px;margin-top:28px;color:#0F172A;">${c.next_steps_title}</h2>
  <ul style="padding-left:20px;color:#475569;">${stepsHtml}</ul>

  <p style="margin-top:24px;color:#475569;">${c.signoff}</p>
</body></html>`;

  const text = [
    c.intro,
    '',
    c.body,
    '',
    `${c.cta_book}: ${calendlyUrl}`,
    '',
    c.cta_email,
    '',
    c.next_steps_title,
    ...c.next_steps.map((s) => `- ${s.replace(/<[^>]+>/g, '')}`),
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

