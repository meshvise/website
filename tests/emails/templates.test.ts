/**
 * Tests on the 3 email templates: welcome, reminder, post-mortem.
 *
 * No I/O here. The templates are pure functions of (lang, name, jwt,
 * urls). We assert: language switching works, attachments are correctly
 * shaped for Resend's API, no em-dashes leak in (hard rule), and no
 * competitor names are mentioned.
 */
import { describe, it, expect } from 'vitest';
import { renderWelcomeEmail } from '../../src/emails/welcome.js';
import { renderReminderEmail } from '../../src/emails/reminder.js';
import { renderPostMortemEmail } from '../../src/emails/post-mortem.js';
import { DOCKER_COMPOSE_YML } from '../../src/emails/docker-compose.js';

const FORBIDDEN_NAMES = ['Niagara', 'Ignition', 'EcoStruxure', 'Tridium', 'Inductive Automation', 'Workbench', 'JACE'];
const EM_DASH = '—';

function assertCleanCopy(rendered: { subject: string; html: string; text: string }) {
  for (const surface of [rendered.subject, rendered.html, rendered.text]) {
    expect(surface, `em-dash in: ${surface.slice(0, 80)}`).not.toContain(EM_DASH);
    for (const name of FORBIDDEN_NAMES) {
      expect(surface, `competitor "${name}" in: ${surface.slice(0, 80)}`).not.toMatch(new RegExp(name, 'i'));
    }
  }
}

describe('renderWelcomeEmail', () => {
  it('returns a French subject + body when lang=fr', () => {
    const r = renderWelcomeEmail({ lang: 'fr', name: 'Bruno', jwt: 'a.b.c', docsUrl: 'https://docs/' });
    expect(r.subject).toMatch(/essai Wiregrid/i);
    expect(r.html).toContain('Bonjour');
    expect(r.text).toContain('Bonjour');
    assertCleanCopy(r);
  });

  it('returns an English subject + body when lang=en', () => {
    const r = renderWelcomeEmail({ lang: 'en', name: 'Bruno', jwt: 'a.b.c', docsUrl: 'https://docs/' });
    expect(r.subject).toMatch(/Wiregrid 7-day trial/i);
    expect(r.html).toContain('Hi');
    assertCleanCopy(r);
  });

  it('handles a missing name gracefully (no trailing comma orphan)', () => {
    const r = renderWelcomeEmail({ lang: 'fr', name: '', jwt: 'a.b.c' });
    expect(r.html).toContain('Bonjour,');
    expect(r.html).not.toMatch(/Bonjour\s+,/);
  });

  it('attaches license.jwt and docker-compose.yml as base64', () => {
    const r = renderWelcomeEmail({ lang: 'en', name: 'A', jwt: 'a.b.c' });
    expect(r.attachments).toHaveLength(2);

    const license = r.attachments[0];
    expect(license.filename).toBe('license.jwt');
    expect(license.content_type).toBe('application/jwt');
    expect(Buffer.from(license.content, 'base64').toString('utf-8')).toBe('a.b.c');

    const compose = r.attachments[1];
    expect(compose.filename).toBe('docker-compose.yml');
    expect(compose.content_type).toBe('text/yaml');
    expect(Buffer.from(compose.content, 'base64').toString('utf-8')).toBe(DOCKER_COMPOSE_YML);
  });

  it('escapes HTML in the greeting name', () => {
    const r = renderWelcomeEmail({ lang: 'en', name: '<script>x</script>', jwt: 'a.b.c' });
    expect(r.html).not.toContain('<script>x</script>');
    expect(r.html).toContain('&lt;script&gt;x&lt;/script&gt;');
  });
});

describe('renderReminderEmail', () => {
  it('returns the reminder subject in FR', () => {
    const r = renderReminderEmail({ lang: 'fr', name: 'A', calendlyUrl: 'https://cal/x' });
    expect(r.subject).toMatch(/24 heures/i);
    expect(r.html).toContain('https://cal/x');
    assertCleanCopy(r);
  });

  it('returns the reminder subject in EN', () => {
    const r = renderReminderEmail({ lang: 'en', name: 'A', calendlyUrl: 'https://cal/x' });
    expect(r.subject).toMatch(/24 hours/i);
    expect(r.html).toContain('https://cal/x');
    assertCleanCopy(r);
  });
});

describe('renderPostMortemEmail', () => {
  it('returns the post-mortem subject in FR', () => {
    const r = renderPostMortemEmail({ lang: 'fr', name: 'A', calendlyUrl: 'https://cal/x' });
    expect(r.subject).toMatch(/essai Wiregrid est terminé/i);
    expect(r.html).toContain('https://cal/x');
    assertCleanCopy(r);
  });

  it('returns the post-mortem subject in EN', () => {
    const r = renderPostMortemEmail({ lang: 'en', name: 'A', calendlyUrl: 'https://cal/x' });
    expect(r.subject).toMatch(/trial has ended/i);
    expect(r.html).toContain('https://cal/x');
    assertCleanCopy(r);
  });
});

describe('docker-compose.yml string', () => {
  it('mentions the gateway-py image and the license mount', () => {
    expect(DOCKER_COMPOSE_YML).toContain('gateway-py');
    expect(DOCKER_COMPOSE_YML).toContain('/etc/wiregrid/license.jwt');
    expect(DOCKER_COMPOSE_YML).toContain('docker compose up -d');
  });

  it('has no em-dashes', () => {
    expect(DOCKER_COMPOSE_YML).not.toContain(EM_DASH);
  });
});
