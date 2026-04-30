/**
 * Cloudflare Worker entry. Routes:
 *   POST /api/trial → handleTrialRequest (Vague 5)
 *   *               → env.ASSETS.fetch (static site from ./dist)
 *
 * Same-origin form POST, so no CORS / OPTIONS handling needed. The
 * trial form lives on https://wiregrid.fr/<lang>/trial/ and posts to
 * /api/trial on the same origin.
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
