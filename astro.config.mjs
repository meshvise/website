// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://meshvise.com',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR', en: 'en-US' },
      },
    }),
  ],
  /*
   * Le serveur de développement, fixé plutôt que laissé au hasard.
   *
   * `host` : sans lui, Astro n'écoute qu'en IPv6, donc `localhost:4321`
   * répond et `127.0.0.1:4321` non. Une seule URL pour tout le monde.
   *
   * `strictPort` : sans lui, un second lancement s'installe en silence sur
   * 4322 et personne ne voit le doublon. Il échoue maintenant bruyamment,
   * ce qui est l'objectif.
   */
  server: {
    host: '127.0.0.1',
    port: 4321,
    strictPort: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

