// Cloudflare Turnstile siteverify wrapper.
//
// Spec: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
// In production, env.TURNSTILE_SECRET_KEY is the real Turnstile secret. In
// tests / local dev with no secret, callers should use the always-passes
// test secret 1x0000000000000000000000000000000AA paired with the test
// siteKey 1x00000000000000000000AA.

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile({ secret, token, remoteIp, fetchImpl = fetch }) {
  if (!secret) return { success: false, reason: 'missing-secret' };
  if (!token || typeof token !== 'string') return { success: false, reason: 'missing-token' };

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (remoteIp) body.append('remoteip', remoteIp);

  let res;
  try {
    res = await fetchImpl(SITEVERIFY_URL, { method: 'POST', body });
  } catch (err) {
    return { success: false, reason: 'network-error', detail: String(err) };
  }
  if (!res.ok) {
    return { success: false, reason: `http-${res.status}` };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    return { success: false, reason: 'bad-json' };
  }

  if (data && data.success === true) return { success: true };
  return {
    success: false,
    reason: 'rejected',
    errorCodes: Array.isArray(data?.['error-codes']) ? data['error-codes'] : [],
  };
}
