// Welcome email sent immediately on /api/trial success. Carries the
// license.jwt as attachment + docker-compose.yml + the install command.
// FR / EN switched on the lang the form submitted with.

import { buildDockerComposeYml } from './docker-compose.js';

const COPY = {
  fr: {
    subject: 'Votre licence d\'essai Meshvise, valide sept jours',
    greeting: (name) => (name ? `Bonjour ${name},` : 'Bonjour,'),
    intro: 'Voici votre licence d\'essai Meshvise, valide sept jours. La licence et le fichier de déploiement sont en pièce jointe.',
    steps_title: 'L\'installation',
    steps: [
      'Téléchargez les deux pièces jointes (<strong>license.jwt</strong> et <strong>docker-compose.yml</strong>) dans un même dossier.',
      'Dans ce dossier, lancez <code>docker compose up -d</code> depuis votre terminal.',
      'Patientez 30 secondes puis ouvrez <a href="http://localhost:8001">http://localhost:8001</a> · login <code>admin@meshvise.local</code> / <code>meshvise</code>.',
    ],
    docs_link_text: 'Documentation d\'installation complète',
    limits_title: 'Limites de cet essai',
    limits: [
      '5 drivers · 15 machines · 500 points',
      'Toutes les fonctions : acquisition, historisation, alarmes, logique visuelle, accès SQL',
      'Durée : sept jours. À l\'expiration, l\'application passe en lecture seule, vos données restent vôtres.',
    ],
    next: 'Je vous écrirai dans six jours pour faire le point. D\'ici là, toute question se répond directement à ce courriel.',
    signoff: 'Bruno · Meshvise',
  },
  en: {
    subject: 'Your Meshvise trial licence, valid for seven days',
    greeting: (name) => (name ? `Hello ${name},` : 'Hello,'),
    intro: 'Here is your Meshvise trial licence, valid for seven days. The licence and the deployment file are attached.',
    steps_title: 'Installation',
    steps: [
      'Download the two attachments (<strong>license.jwt</strong> and <strong>docker-compose.yml</strong>) into a single folder.',
      'In that folder, run <code>docker compose up -d</code> from your terminal.',
      'Wait 30 seconds, then open <a href="http://localhost:8001">http://localhost:8001</a> · login <code>admin@meshvise.local</code> / <code>meshvise</code>.',
    ],
    docs_link_text: 'Full install documentation',
    limits_title: 'Trial limits',
    limits: [
      '5 drivers · 15 machines · 500 points',
      'All features: acquisition, history, alarms, visual logic, SQL access',
      'Duration: seven days. On expiry, the application switches to read-only and your data stays yours.',
    ],
    next: 'I will write in six days to review it with you. Until then, any question can be answered by replying to this email.',
    signoff: 'Bruno · Meshvise',
  },
};

export function renderWelcomeEmail({ lang, name, jwt, docsUrl = 'https://meshvise.com', imageTag }) {
  const c = COPY[lang === 'en' ? 'en' : 'fr'];
  const greeting = c.greeting(name);
  const stepsHtml = c.steps.map((s) => `<li>${s}</li>`).join('');
  const limitsHtml = c.limits.map((s) => `<li>${s}</li>`).join('');

  const html = `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#161b23;max-width:600px;margin:0 auto;padding:24px;line-height:1.55;">
  <p>${escapeHtml(greeting)}</p>
  <p>${c.intro}</p>

  <h2 style="font-size:18px;margin-top:28px;color:#161b23;">${c.steps_title}</h2>
  <ol style="padding-left:20px;">${stepsHtml}</ol>

  <p><a href="${escapeAttr(docsUrl)}" style="color:#5b4a94;">${c.docs_link_text}</a></p>

  <h2 style="font-size:18px;margin-top:28px;color:#161b23;">${c.limits_title}</h2>
  <ul style="padding-left:20px;">${limitsHtml}</ul>

  <p style="margin-top:28px;">${c.next}</p>
  <p style="margin-top:24px;color:#475569;">${c.signoff}</p>
</body></html>`;

  const text = renderWelcomeText(c, docsUrl, greeting);

  const attachments = [
    {
      filename: 'license.jwt',
      content: base64Encode(jwt),
      content_type: 'application/jwt',
    },
    {
      filename: 'docker-compose.yml',
      content: base64Encode(buildDockerComposeYml({ imageTag })),
      content_type: 'text/yaml',
    },
  ];

  return { subject: c.subject, html, text, attachments };
}

function renderWelcomeText(c, docsUrl, greeting) {
  const stripHtml = (s) => s.replace(/<[^>]+>/g, '');
  const lines = [
    greeting,
    '',
    stripHtml(c.intro),
    '',
    c.steps_title,
    ...c.steps.map((s, i) => `${i + 1}. ${stripHtml(s)}`),
    '',
    `${c.docs_link_text}: ${docsUrl}`,
    '',
    c.limits_title,
    ...c.limits.map((s) => `- ${stripHtml(s)}`),
    '',
    c.next,
    '',
    c.signoff,
  ];
  return lines.join('\n');
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

// Resend's REST API expects attachment.content as a base64 string.
function base64Encode(input) {
  if (typeof input === 'string') {
    // Use TextEncoder so multi-byte UTF-8 chars survive the round-trip.
    const bytes = new TextEncoder().encode(input);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  // Already bytes (e.g. Uint8Array)
  let bin = '';
  for (let i = 0; i < input.length; i += 1) bin += String.fromCharCode(input[i]);
  return btoa(bin);
}


