// Ed25519 JWT signer for trial licences. Pure Web Crypto, runs in
// Cloudflare Workers and Node 20+ (vitest) without any extra deps.
//
// JWT schema is frozen by ADR-0006 § 8. Don't change field names without
// bumping a schema_version claim.

const TRIAL_DURATION_S = 7 * 24 * 3600;
const TRIAL_LIMITS = Object.freeze({
  points: 500,
  machines: 15,
  drivers: 5,
  max_projects: 1,
});
const TRIAL_FEATURES = Object.freeze(['read', 'write', 'history', 'alarms', 'wiresheet']);

function base64UrlEncodeBytes(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 1) {
    s += String.fromCharCode(bytes[i]);
  }
  return btoa(s).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function base64UrlEncodeString(str) {
  return base64UrlEncodeBytes(new TextEncoder().encode(str));
}

function base64Decode(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

// Strip the BEGIN/END headers + whitespace from a PEM-encoded PKCS#8
// private key and return the raw DER bytes.
function pemToDer(pem) {
  const stripped = pem
    .replaceAll(/-----BEGIN [^-]+-----/g, '')
    .replaceAll(/-----END [^-]+-----/g, '')
    .replaceAll(/\s+/g, '');
  if (!stripped) {
    throw new Error('PEM payload is empty');
  }
  return base64Decode(stripped);
}

export async function importEd25519PrivateKey(pem) {
  const der = pemToDer(pem);
  return crypto.subtle.importKey('pkcs8', der, { name: 'Ed25519' }, false, ['sign']);
}

export function buildTrialClaims({ email, name, company, now, jti }) {
  const iat = Math.floor(now / 1000);
  const exp = iat + TRIAL_DURATION_S;
  return {
    iss: 'meshvise-trial-signer',
    sub: `trial:${email}`,
    jti,
    tier: 'trial',
    iat,
    exp,
    limits: { ...TRIAL_LIMITS },
    features: [...TRIAL_FEATURES],
    binding: null,
    issued_to: {
      name: name ?? null,
      company: company ?? null,
    },
  };
}

export async function signJwt(privateKey, claims) {
  const header = { alg: 'EdDSA', typ: 'JWT' };
  const headerB64 = base64UrlEncodeString(JSON.stringify(header));
  const payloadB64 = base64UrlEncodeString(JSON.stringify(claims));
  const signingInput = `${headerB64}.${payloadB64}`;
  const signature = await crypto.subtle.sign(
    'Ed25519',
    privateKey,
    new TextEncoder().encode(signingInput),
  );
  const signatureB64 = base64UrlEncodeBytes(new Uint8Array(signature));
  return `${signingInput}.${signatureB64}`;
}

export const TRIAL_DEFAULTS = {
  duration_s: TRIAL_DURATION_S,
  limits: TRIAL_LIMITS,
  features: TRIAL_FEATURES,
};

