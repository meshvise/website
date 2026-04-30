// Post-mortem email scheduled at iat + 170h (= 2h after trial expiry).
// Tone: curious, not pushy. Either help us improve or move forward.

const COPY = {
  fr: {
    subject: 'Votre essai Wiregrid est terminé',
    greeting: (name) => (name ? `Bonjour ${name},` : 'Bonjour,'),
    intro: 'Votre essai s\'est terminé il y a quelques heures. L\'app est maintenant en lecture seule sur votre installation : vos données et votre configuration restent accessibles, mais les écritures sont bloquées.',
    body: 'Quoi que vous ayez décidé, ça nous intéresse. Si Wiregrid colle à votre besoin, on bascule sur une licence de production en 5 minutes. Si ça ne colle pas, dites-nous ce qui a manqué : c\'est précieux pour la suite.',
    cta_book: 'Échanger 15 minutes',
    cta_email: 'Ou répondez simplement à cet email avec ce que vous avez retenu.',
    next_steps_title: 'Si vous voulez passer en production',
    next_steps: [
      'Forfait annuel plat, 990 € HT, points illimités, support dédié.',
      'Migration de votre install d\'essai sans perte : on génère une licence permanente, vous redémarrez la stack, c\'est tout.',
      'Engagement 12 mois. Vos données restent chez vous, sur votre serveur.',
    ],
    signoff: 'Bruno · Wiregrid',
  },
  en: {
    subject: 'Your Wiregrid trial has ended',
    greeting: (name) => (name ? `Hi ${name},` : 'Hi,'),
    intro: 'Your trial ended a couple of hours ago. The app on your install is now read-only: your data and configuration stay accessible, writes are blocked.',
    body: 'Whatever you decided, we\'d like to hear from you. If Wiregrid fits your need, we can switch you to a production licence in 5 minutes. If it doesn\'t, tell us what was missing. That input shapes what we build next.',
    cta_book: 'Chat for 15 minutes',
    cta_email: 'Or just reply to this email with what stuck with you.',
    next_steps_title: 'If you want to move to production',
    next_steps: [
      'Flat annual fee, €990 excl. VAT, unlimited points, dedicated support.',
      'Migrate from your trial install with no data loss: we issue a permanent licence, you restart the stack, done.',
      '12-month commitment. Your data stays on your server, in your hands.',
    ],
    signoff: 'Bruno · Wiregrid',
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
