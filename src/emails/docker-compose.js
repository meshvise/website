// Minimal docker-compose.yml shipped to trial users as an attachment.
// Three services: postgres (with TimescaleDB), redis, gateway-py. The
// gateway-py image tag is read from an env var so we can rev it without
// regenerating outstanding licences. license.jwt is read-only mounted
// from the same folder where the user saved the email attachments.

export const DOCKER_COMPOSE_YML = `# Wiregrid trial stack: quickstart docker-compose.yml
# Save license.jwt next to this file, then run:
#   docker compose up -d
# After ~30 seconds, open http://localhost:8001 (admin@wiregrid.local / wiregrid).

services:
  postgres:
    image: timescale/timescaledb-ha:pg16
    restart: unless-stopped
    environment:
      POSTGRES_USER: wiregrid
      POSTGRES_PASSWORD: wiregrid
      POSTGRES_DB: wiregrid
    volumes:
      - pgdata:/home/postgres/pgdata/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U wiregrid"]
      interval: 5s
      timeout: 3s
      retries: 20

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  gateway-py:
    image: ghcr.io/tatex74/wiregrid-gateway-py:latest
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    ports:
      - "8001:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://wiregrid:wiregrid@postgres:5432/wiregrid
      REDIS_URL: redis://redis:6379/0
      WIREGRID_LICENSE_FILE: /etc/wiregrid/license.jwt
    volumes:
      - ./license.jwt:/etc/wiregrid/license.jwt:ro

volumes:
  pgdata:
`;
