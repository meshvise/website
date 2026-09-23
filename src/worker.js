/**
 * Cloudflare Worker entry. Routes:
 *   POST /api/trial → handleTrialRequest (Vague 5)
 *   *               → env.ASSETS.fetch (static site from ./dist)
 *
 * Same-origin form POST, so no CORS / OPTIONS handling needed. No page
 * posts to it today: the trial is on quote since 2026-09-22 and requested
 * through the Contact page, and the trial page was removed on 2026-09-23.
 * The endpoint stays, specified by ADR-0006.
 */

import { handleTrialRequest } from './worker/handlers/trial.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/trial') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', {
          status: 405,
          headers: { allow: 'POST' },
        });
      }
      return handleTrialRequest(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

