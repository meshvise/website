/**
 * Garde-fou sur les dictionnaires de traduction.
 *
 * Porte sur les sources et non sur `dist` : une clé manquante doit faire
 * échouer le test à l'écriture, pas seulement après une construction.
 *
 * Deux paires indépendantes, parce que les textes des figures animées ont
 * leur propre dictionnaire depuis que deux personnes écrivaient dans le même
 * fichier et se marchaient dessus.
 */
import { describe, it, expect } from 'vitest';
import fr from '../src/i18n/fr.json';
import en from '../src/i18n/en.json';
import motionFr from '../src/i18n/motion.fr.json';
import motionEn from '../src/i18n/motion.en.json';

type Node = unknown;

/**
 * Aplatit en chemins pointés, index de tableaux compris. Comparer des chemins
 * plutôt que des objets niveau par niveau attrape le cas qui passe le plus
 * facilement : une clé présente des deux côtés, objet ici et chaîne là.
 */
function flatten(node: Node, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  if (Array.isArray(node)) {
    node.forEach((v, i) => {
      for (const [k, t] of flatten(v, `${prefix}[${i}]`)) out.set(k, t);
    });
  } else if (node !== null && typeof node === 'object') {
    for (const [key, v] of Object.entries(node as Record<string, Node>)) {
      const path = prefix ? `${prefix}.${key}` : key;
      for (const [k, t] of flatten(v, path)) out.set(k, t);
    }
  } else {
    out.set(prefix, typeof node);
  }
  return out;
}

const PAIRS = [
  { name: 'site', fr, en },
  { name: 'figures animées', fr: motionFr, en: motionEn },
] as const;

describe.each(PAIRS)('dictionnaire $name', ({ fr: frDict, en: enDict }) => {
  const a = flatten(frDict);
  const b = flatten(enDict);

  it('porte exactement les mêmes clés dans les deux langues', () => {
    const manquantEn = [...a.keys()].filter((k) => !b.has(k));
    const manquantFr = [...b.keys()].filter((k) => !a.has(k));
    expect({ manquantEn, manquantFr }).toEqual({ manquantEn: [], manquantFr: [] });
  });

  it('donne la même forme à chaque valeur', () => {
    const divergent = [...a.entries()]
      .filter(([k, t]) => b.has(k) && b.get(k) !== t)
      .map(([k, t]) => `${k}: fr=${t}, en=${b.get(k)}`);
    expect(divergent).toEqual([]);
  });

  /**
   * Règle dure du dépôt. Le test sur le HTML produit ne cherchait que le
   * cadratin ; le demi-cadratin passait au travers, et rien ne le distingue
   * à l'oeil dans un éditeur.
   */
  it('ne contient ni tiret cadratin ni tiret demi-cadratin', () => {
    const fautifs: string[] = [];
    for (const [dict, langue] of [[frDict, 'fr'], [enDict, 'en']] as const) {
      for (const [k, type] of flatten(dict)) {
        if (type !== 'string') continue;
        const valeur = k.split(/[.[\]]/).filter(Boolean).reduce<any>((o, part) => o[part], dict);
        if (typeof valeur === 'string' && /[—–]/.test(valeur)) {
          fautifs.push(`${langue}.${k}`);
        }
      }
    }
    expect(fautifs).toEqual([]);
  });
});
