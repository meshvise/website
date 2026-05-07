# Meshvise — Vitrine

Landing page for Meshvise ([app.meshvise.com](https://app.meshvise.com)), served from [meshvise.com](https://meshvise.com).

Built with [Astro 6](https://astro.build/), served as static assets by a [Cloudflare Worker](https://developers.cloudflare.com/workers/).

The form on the landing page posts to the Laravel app at `https://app.meshvise.com/api/demo-request` to provision a demo project (handled by the [meshvise](https://github.com/meshvise/meshvise) repo).

## Branches

| Branch | Role |
|--------|------|
| `master` | Prod — what is deployed on Cloudflare |
| `dev` | Integration — features accumulate here before being promoted to master |

## Dev

```sh
npm install
npm run dev       # → http://localhost:4321
```

## Build & Deploy

```sh
npm run build     # outputs to ./dist
npx wrangler deploy
```

`wrangler.jsonc` points Cloudflare at `./dist` for static assets.

## Structure

```
src/
├── pages/          # routes (en/, fr/, apex)
├── components/     # Astro components (Hero, Features, Pricing, …)
├── layouts/Base.astro
├── i18n/           # en.json + fr.json + helper
└── styles/global.css
```

i18n : all user-facing strings live in `src/i18n/{en,fr}.json`, accessed via `t(lang, 'key')`. Default lang is `fr`.


