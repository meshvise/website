/**
 * Tests for src/worker/license.js — claims schema (ADR-0006 § 8) and
 * Ed25519 signature round-trip via Web Crypto.
 *
 * No private key is ever read from disk. Each test generates a fresh
 * ephemeral keypair via crypto.subtle.generateKey, exports to PEM, signs,
 * then verifies with the matching public key.
 */
import { describe, it, expect } from 'vitest';
import {
  buildTrialClaims,
  importEd25519PrivateKey,
  signJwt,
  TRIAL_DEFAULTS,
} from '../../src/worker/license.js';

async function generateEd25519Pem() {
  const kp = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
  const der = new Uint8Array(await crypto.subtle.exportKey('pkcs8', kp.privateKey));
  const b64 = Buffer.from(der).toString('base64');
  const pem = `-----BEGIN PRIVATE KEY-----\n${b64.match(/.{1,64}/g)!.join('\n')}\n-----END PRIVATE KEY-----`;
  return { pem, publicKey: kp.publicKey };
}

function base64UrlDecode(str: string): Uint8Array {
  const b64 = str.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(str.length / 4) * 4, '=');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

describe('buildTrialClaims', () => {
  it('produces the exact ADR-0006 § 8 schema for a trial', () => {
    const claims = buildTrialClaims({
      email: 'demo@example.com',
      name: 'Demo User',
      company: 'Acme',
      now: 1_700_000_000_000,
      jti: 'fixed-jti',
    });
    expect(claims).toEqual({
      iss: 'wiregrid-trial-signer',
      sub: 'trial:demo@example.com',
      jti: 'fixed-jti',
      tier: 'trial',
      iat: 1_700_000_000,
      exp: 1_700_000_000 + 7 * 24 * 3600,
      limits: { points: 500, machines: 15, drivers: 5, max_projects: 1 },
      features: ['read', 'write', 'history', 'alarms', 'wiresheet'],
      binding: null,
      issued_to: { name: 'Demo User', company: 'Acme' },
    });
  });

  it('handles missing company by setting null in issued_to', () => {
    const claims = buildTrialClaims({
      email: 'a@b.c',
      name: 'A',
      company: null,
      now: 0,
      jti: 'j',
    });
    expect(claims.issued_to).toEqual({ name: 'A', company: null });
  });

  it('exposes default trial settings as a stable constant', () => {
    expect(TRIAL_DEFAULTS.duration_s).toBe(7 * 24 * 3600);
    expect(TRIAL_DEFAULTS.limits).toEqual({ points: 500, machines: 15, drivers: 5, max_projects: 1 });
    expect(TRIAL_DEFAULTS.features).toEqual(['read', 'write', 'history', 'alarms', 'wiresheet']);
  });
});

describe('signJwt + Ed25519 round-trip', () => {
  it('emits a 3-part JWT with header alg=EdDSA', async () => {
    const { pem } = await generateEd25519Pem();
    const privateKey = await importEd25519PrivateKey(pem);
    const claims = buildTrialClaims({ email: 'x@y.z', name: 'X', company: null, now: Date.now(), jti: 'j' });
    const jwt = await signJwt(privateKey, claims);

    const parts = jwt.split('.');
    expect(parts).toHaveLength(3);

    const headerJson = new TextDecoder().decode(base64UrlDecode(parts[0]));
    expect(JSON.parse(headerJson)).toEqual({ alg: 'EdDSA', typ: 'JWT' });
  });

  it('signature verifies against the matching public key', async () => {
    const { pem, publicKey } = await generateEd25519Pem();
    const privateKey = await importEd25519PrivateKey(pem);
    const claims = buildTrialClaims({ email: 'x@y.z', name: 'X', company: null, now: Date.now(), jti: 'j' });
    const jwt = await signJwt(privateKey, claims);

    const [headerB64, payloadB64, signatureB64] = jwt.split('.');
    const signingInput = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlDecode(signatureB64);

    const ok = await crypto.subtle.verify('Ed25519', publicKey, signature, signingInput);
    expect(ok).toBe(true);
  });

  it('signature is rejected if the payload is tampered with', async () => {
    const { pem, publicKey } = await generateEd25519Pem();
    const privateKey = await importEd25519PrivateKey(pem);
    const claims = buildTrialClaims({ email: 'x@y.z', name: 'X', company: null, now: Date.now(), jti: 'j' });
    const jwt = await signJwt(privateKey, claims);

    const [headerB64, , signatureB64] = jwt.split('.');
    const tamperedPayload = btoa(JSON.stringify({ ...claims, tier: 'production' }))
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replaceAll('=', '');
    const signingInput = new TextEncoder().encode(`${headerB64}.${tamperedPayload}`);
    const signature = base64UrlDecode(signatureB64);

    const ok = await crypto.subtle.verify('Ed25519', publicKey, signature, signingInput);
    expect(ok).toBe(false);
  });
});

describe('importEd25519PrivateKey edge cases', () => {
  it('rejects an empty PEM payload', async () => {
    await expect(
      importEd25519PrivateKey('-----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----'),
    ).rejects.toThrow();
  });
});
