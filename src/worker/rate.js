// Rate limit + KV dedupe helpers.
//
// Two layers per ADR-0006 § 1:
// 1. Fast spam shield via the native Cloudflare Rate Limiting binding,
//    3 req per 60s per IP. Native simple bindings only support
//    period=10|60s, so the long window is implemented in KV below.
// 2. Slow burn protection in KV: 3 req per 24h per IP (key `ip:<addr>`)
//    + 1 trial per email per 30d (key `email:<lower>`).
//
// All windows / limits are passed in as constants by the caller, easy to
// override in tests.

const IP_WINDOW_S = 24 * 3600;
const IP_LIMIT = 3;
const EMAIL_TTL_S = 30 * 24 * 3600;

export const RATE_CONSTANTS = {
  IP_WINDOW_S,
  IP_LIMIT,
  EMAIL_TTL_S,
};

// Native Workers Rate Limiting binding wrapper. Returns true if the
// request passes (under threshold), false otherwise. If the binding is
// missing (e.g. local vitest), returns true so logic downstream still
// runs.
export async function checkNativeRateLimit(rateLimiter, key) {
  if (!rateLimiter || typeof rateLimiter.limit !== 'function') return { allowed: true };
  try {
    const { success } = await rateLimiter.limit({ key });
    return { allowed: success === true };
  } catch (err) {
    // If the binding errors, fail open. Logged by caller.
    return { allowed: true, error: String(err) };
  }
}

// 24h IP window in KV. Stores a JSON counter under `ip:<addr>` with TTL
// 24h, increments on each request. If count > limit, refuse. Atomicity is
// best-effort (KV doesn't have CAS), but the small race window means at
// worst one extra request slips through, not a meaningful abuse vector.
export async function checkIpWindow(kv, ip, { limit = IP_LIMIT, ttl = IP_WINDOW_S, now = Date.now() } = {}) {
  if (!kv) return { allowed: true };
  const key = `ip:${ip}`;
  const raw = await kv.get(key);
  let count = 0;
  let firstSeen = now;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.count === 'number') count = parsed.count;
      if (typeof parsed.firstSeen === 'number') firstSeen = parsed.firstSeen;
    } catch {
      // Corrupt entry, treat as fresh.
    }
  }
  if (count >= limit) {
    return { allowed: false, count, firstSeen };
  }
  const next = { count: count + 1, firstSeen };
  // KV TTL is computed from the original firstSeen so the window stays
  // anchored on the first request, not extended on each hit.
  const remainingTtl = Math.max(60, ttl - Math.floor((now - firstSeen) / 1000));
  await kv.put(key, JSON.stringify(next), { expirationTtl: remainingTtl });
  return { allowed: true, count: next.count };
}

// 30-day email dedupe. Returns true if the email is still in the window.
export async function isEmailDedupe(kv, email) {
  if (!kv) return false;
  const raw = await kv.get(`email:${email}`);
  return raw !== null && raw !== undefined;
}

// Mark an email as dedupe'd for 30 days.
export async function recordEmailIssued(kv, email, jti, ttl = EMAIL_TTL_S) {
  if (!kv) return;
  await kv.put(
    `email:${email}`,
    JSON.stringify({ jti, issuedAt: Date.now() }),
    { expirationTtl: ttl },
  );
}

// Best-effort rollback if the welcome send fails after we've written the
// dedupe key. KV.delete is idempotent.
export async function rollbackEmailDedupe(kv, email) {
  if (!kv) return;
  try {
    await kv.delete(`email:${email}`);
  } catch {
    // Swallow; not worth surfacing.
  }
}
