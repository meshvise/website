/**
 * Tests for src/worker/rate.js. KV is mocked as a Map-backed object that
 * mimics the Cloudflare KV API surface used by the module (get, put,
 * delete). Native rate limiter is similarly mocked with a counter.
 */
import { describe, it, expect } from 'vitest';
import {
  checkNativeRateLimit,
  checkIpWindow,
  isEmailDedupe,
  recordEmailIssued,
  rollbackEmailDedupe,
} from '../../src/worker/rate.js';

function makeKv() {
  const store = new Map<string, { value: string; expirationTtl?: number }>();
  return {
    store,
    async get(key: string) {
      const entry = store.get(key);
      return entry ? entry.value : null;
    },
    async put(key: string, value: string, opts: { expirationTtl?: number } = {}) {
      store.set(key, { value, expirationTtl: opts.expirationTtl });
    },
    async delete(key: string) {
      store.delete(key);
    },
  };
}

function makeRateLimiter(allowedSequence: boolean[]) {
  let i = 0;
  return {
    calls: [] as Array<{ key: string }>,
    async limit(args: { key: string }) {
      this.calls.push(args);
      const success = allowedSequence[i] ?? allowedSequence[allowedSequence.length - 1] ?? true;
      i += 1;
      return { success };
    },
  };
}

describe('checkNativeRateLimit', () => {
  it('returns allowed=true when binding is missing', async () => {
    const res = await checkNativeRateLimit(undefined, 'k');
    expect(res).toEqual({ allowed: true });
  });

  it('forwards the result from the native binding', async () => {
    const limiter = makeRateLimiter([true, true, false]);
    const a = await checkNativeRateLimit(limiter, 'ip:1.2.3.4');
    const b = await checkNativeRateLimit(limiter, 'ip:1.2.3.4');
    const c = await checkNativeRateLimit(limiter, 'ip:1.2.3.4');
    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
    expect(c.allowed).toBe(false);
    expect(limiter.calls).toHaveLength(3);
    expect(limiter.calls[0]).toEqual({ key: 'ip:1.2.3.4' });
  });

  it('fails open if the binding throws', async () => {
    const limiter = {
      async limit() { throw new Error('boom'); },
    };
    const res = await checkNativeRateLimit(limiter, 'k');
    expect(res.allowed).toBe(true);
    expect(res.error).toContain('boom');
  });
});

describe('checkIpWindow (24h KV)', () => {
  it('first request passes and writes count=1', async () => {
    const kv = makeKv();
    const now = Date.UTC(2026, 3, 30, 10, 0, 0);
    const res = await checkIpWindow(kv, '1.2.3.4', { now });
    expect(res.allowed).toBe(true);
    expect(res.count).toBe(1);

    const stored = kv.store.get('ip:1.2.3.4');
    expect(stored).toBeDefined();
    expect(JSON.parse(stored!.value)).toEqual({ count: 1, firstSeen: now });
  });

  it('second + third requests still pass', async () => {
    const kv = makeKv();
    const now = Date.UTC(2026, 3, 30, 10, 0, 0);
    await checkIpWindow(kv, '1.2.3.4', { now });
    const r2 = await checkIpWindow(kv, '1.2.3.4', { now: now + 1000 });
    const r3 = await checkIpWindow(kv, '1.2.3.4', { now: now + 2000 });
    expect(r2.allowed).toBe(true);
    expect(r3.allowed).toBe(true);
    expect(r3.count).toBe(3);
  });

  it('fourth request is refused', async () => {
    const kv = makeKv();
    const now = Date.UTC(2026, 3, 30, 10, 0, 0);
    await checkIpWindow(kv, '1.2.3.4', { now });
    await checkIpWindow(kv, '1.2.3.4', { now });
    await checkIpWindow(kv, '1.2.3.4', { now });
    const r4 = await checkIpWindow(kv, '1.2.3.4', { now });
    expect(r4.allowed).toBe(false);
  });

  it('keeps the TTL anchored on firstSeen so the window does not extend', async () => {
    const kv = makeKv();
    const t0 = 1_700_000_000_000;
    await checkIpWindow(kv, '1.2.3.4', { now: t0, ttl: 86_400 });
    const stored1 = kv.store.get('ip:1.2.3.4')!;
    expect(stored1.expirationTtl).toBeLessThanOrEqual(86_400);
    expect(stored1.expirationTtl).toBeGreaterThanOrEqual(86_399);

    // 12 hours later, second hit. Remaining TTL must be ~12h, not refreshed.
    await checkIpWindow(kv, '1.2.3.4', { now: t0 + 12 * 3600 * 1000, ttl: 86_400 });
    const stored2 = kv.store.get('ip:1.2.3.4')!;
    expect(stored2.expirationTtl).toBeLessThanOrEqual(86_400 - 12 * 3600 + 1);
    expect(stored2.expirationTtl).toBeGreaterThanOrEqual(86_400 - 12 * 3600 - 1);
  });

  it('returns allowed=true when KV binding is missing', async () => {
    const res = await checkIpWindow(undefined, '1.2.3.4');
    expect(res.allowed).toBe(true);
  });
});

describe('email dedupe lifecycle', () => {
  it('isEmailDedupe is false before record, true after', async () => {
    const kv = makeKv();
    expect(await isEmailDedupe(kv, 'a@b.c')).toBe(false);
    await recordEmailIssued(kv, 'a@b.c', 'jti-123');
    expect(await isEmailDedupe(kv, 'a@b.c')).toBe(true);
  });

  it('rollbackEmailDedupe clears the entry', async () => {
    const kv = makeKv();
    await recordEmailIssued(kv, 'a@b.c', 'jti');
    await rollbackEmailDedupe(kv, 'a@b.c');
    expect(await isEmailDedupe(kv, 'a@b.c')).toBe(false);
  });

  it('recordEmailIssued sets the 30-day TTL by default', async () => {
    const kv = makeKv();
    await recordEmailIssued(kv, 'a@b.c', 'jti');
    const stored = kv.store.get('email:a@b.c')!;
    expect(stored.expirationTtl).toBe(30 * 24 * 3600);
    expect(JSON.parse(stored.value)).toMatchObject({ jti: 'jti' });
  });
});
