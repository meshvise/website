import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Les guides. Un fichier Markdown par article, rangé par langue.
 *
 * Le contenu long ne vit pas dans les dictionnaires de traduction : une clé
 * i18n porte une phrase, pas deux mille mots. Chaque guide est donc un
 * fichier, et son identifiant de route vient de son nom.
 */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    /** Le titre affiché, qui sert aussi de balise de page. */
    title: z.string(),
    /** Une phrase, pour la liste et pour la méta-description. */
    description: z.string(),
    /** Date de publication, au format ISO. */
    date: z.coerce.date(),
    /** Langue du contenu, qui décide de la route et de la liste où il apparaît. */
    lang: z.enum(['fr', 'en']),
    /**
     * Ce que le lecteur doit savoir avant de commencer. Affiché en tête, pour
     * qu'il referme la page tout de suite si ce n'est pas pour lui.
     */
    audience: z.string(),
    /** Durée de lecture en minutes, arrondie. */
    minutes: z.number().int().positive(),
    /** Sujets traités, pour le regroupement et le référencement. */
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { guides };
