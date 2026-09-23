/**
 * Cloudflare Worker entry. Routes:
 *   POST /api/contact → handleContactRequest (the Contact page form)
 *   POST /api/trial   → handleTrialRequest (ADR-0006)
 *   *                 → env.ASSETS.fetch (static site from ./dist)
 *
 * Same-origin form POST, so no CORS / OPTIONS handling needed. No page
 * posts to /api/trial today: the trial is on quote since 2026-09-22 and
 * requested through the Contact page. The endpoint stays, specified by
 * ADR-0006.
 */

import { handleContactRequest } from './worker/handlers/contact.js';
import { handleTrialRequest } from './worker/handlers/trial.js';

const ROUTES = {
  '/api/contact': handleContactRequest,
  '/api/trial': handleTrialRequest,
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const handler = ROUTES[url.pathname];
    if (handler) {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', {
          status: 405,
          headers: { allow: 'POST' },
        });
      }
      return handler(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
