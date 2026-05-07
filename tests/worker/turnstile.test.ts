/**
 * Tests for src/worker/turnstile.js. Mocks the global fetch via the
 * fetchImpl injection point so we never hit Cloudflare's real endpoint.
 */
import { describe, it, expect, vi } from 'vitest';
import { verifyTurnstile } from '../../src/worker/turnstile.js';

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
  });
}

describe('verifyTurnstile', () => {
  it('returns success when Cloudflare confirms', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ success: true }));
    const res = await verifyTurnstile({
      secret: 'test-secret',
      token: 'token',
      remoteIp: '127.0.0.1',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(res).toEqual({ success: true });

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    expect(init.method).toBe('POST');
    const body = init.body as FormData;
    expect(body.get('secret')).toBe('test-secret');
    expect(body.get('response')).toBe('token');
    expect(body.get('remoteip')).toBe('127.0.0.1');
  });

  it('returns failure when Cloudflare rejects', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ success: false, 'error-codes': ['invalid-input-response'] }),
    );
    const res = await verifyTurnstile({
      secret: 'x',
      token: 't',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(res.success).toBe(false);
    expect(res.reason).toBe('rejected');
    expect(res.errorCodes).toEqual(['invalid-input-response']);
  });

  it('returns missing-secret without calling fetch', async () => {
    const fetchImpl = vi.fn();
    const res = await verifyTurnstile({
      secret: '',
      token: 't',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(res).toEqual({ success: false, reason: 'missing-secret' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('returns missing-token without calling fetch', async () => {
    const fetchImpl = vi.fn();
    const res = await verifyTurnstile({
      secret: 's',
      token: '',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(res).toEqual({ success: false, reason: 'missing-token' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('handles network errors gracefully', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('boom'));
    const res = await verifyTurnstile({
      secret: 's',
      token: 't',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(res.success).toBe(false);
    expect(res.reason).toBe('network-error');
  });

  it('handles non-2xx responses', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('nope', { status: 503 }));
    const res = await verifyTurnstile({
      secret: 's',
      token: 't',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(res.success).toBe(false);
    expect(res.reason).toBe('http-503');
  });
});
