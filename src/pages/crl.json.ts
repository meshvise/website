// Certificate Revocation List for production licences. Consumed by
// gateway-py at boot and every 6h. Fail-open on the verifier side
// (air-gap-safe) so an unreachable CRL doesn't kill self-hosted sites.
//
// Empty `revoked` while no production licence has been issued. Bruno
// updates the array manually when revoking a licence and bumps
// `version` to invalidate the verifier's cache. See ADR-0006 § 3.

import type { APIRoute } from 'astro';

const CRL = {
  revoked: [] as string[],
  version: 1,
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(CRL), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
};
