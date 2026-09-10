/**
 * Les textes des figures, dans leurs propres dictionnaires.
 *
 * Ils vivaient sous la clé `motion.` de `fr.json` et `en.json`, partagés
 * avec tout le reste du site. Git ne met pas des clés en attente, il met
 * des fichiers : deux sessions qui écrivent dans le même dictionnaire
 * emportent chacune le travail en cours de l'autre au moment de commiter,
 * quelle que soit la discipline. Les fichiers sont donc séparés, et le
 * recouvrement devient impossible plutôt qu'improbable.
 *
 * La forme des clés ne change pas : elles restent préfixées `motion.`, si
 * bien qu'un appel écrit pour l'ancien dictionnaire fonctionne ici sans
 * retouche, et qu'un retour en arrière serait un simple recollage.
 */
import fr from '../../i18n/motion.fr.json';
import en from '../../i18n/motion.en.json';
import type { Lang } from '../../i18n';

const dictionnaires: Record<Lang, unknown> = { fr, en };

/** Même contrat que `t` : chemin pointé, renvoie la clé si elle manque. */
export function mt(lang: Lang, key: string): string {
  let value: unknown = dictionnaires[lang];
  for (const part of key.split('.')) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
}

export type { Lang };
