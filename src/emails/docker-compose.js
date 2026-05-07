// Minimal docker-compose.yml shipped to trial users as an attachment.
// Three services: postgres (with TimescaleDB), redis, gateway-py. The
// gateway-py image tag is parameterised via MESHVISE_IMAGE_TAG (Worker
// var, default DEFAULT_IMAGE_TAG below) so dev-Claude meshvise can pin
// new ghcr releases without touching the vitrine repo. license.jwt is
// read-only mounted from the same folder where the user saved the
// email attachments.

export const DEFAULT_IMAGE_TAG = 'v0.1.0';

export function buildDockerComposeYml({ imageTag = DEFAULT_IMAGE_TAG } = {}) {
  return `# Meshvise trial stack: quickstart docker-compose.yml
# Save license.jwt next to this file, then run:
#   docker compose up -d
# After ~30 seconds, open http://localhost:8001 (admin@meshvise.local / meshvise).

services:
  postgres:
    image: timescale/timescaledb-ha:pg16
    restart: unless-stopped
    environment:
      POSTGRES_USER: meshvise
      POSTGRES_PASSWORD: meshvise
      POSTGRES_DB: meshvise
    volumes:
      - pgdata:/home/postgres/pgdata/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U meshvise"]
      interval: 5s
      timeout: 3s
      retries: 20

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  gateway-py:
    image: ghcr.io/meshvise/meshvise-gateway-py:${imageTag}
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    ports:
      - "8001:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://meshvise:meshvise@postgres:5432/meshvise
      REDIS_URL: redis://redis:6379/0
      MESHVISE_LICENSE_FILE: /etc/meshvise/license.jwt
    volumes:
      - ./license.jwt:/etc/meshvise/license.jwt:ro

volumes:
  pgdata:
`;
}

// Backwards-compat: existing callers can still import a default-tag
// string. Tests assert on this so dev-mode keeps working without env.
export const DOCKER_COMPOSE_YML = buildDockerComposeYml();

