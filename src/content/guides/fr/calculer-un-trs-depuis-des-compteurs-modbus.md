---
title: "Calculer un taux de rendement synthétique depuis des compteurs Modbus"
description: "Trois signaux suffisent pour un TRS honnête. Le plus difficile n'est pas de le calculer, c'est de savoir quoi faire quand la donnée manque."
date: 2026-09-08
lang: fr
audience: "Responsable production, service méthodes, automaticien"
minutes: 10
tags: ["TRS", "OEE", "Modbus", "micro-arrêts", "indicateurs"]
---

Le taux de rendement synthétique, ou TRS, est l'indicateur le plus utilisé de
l'industrie et le plus mal calculé. Dans la plupart des ateliers il vit dans un
tableur, il se remplit le vendredi de mémoire, et deux équipes qui font le même
travail affichent des chiffres qu'on ne peut pas comparer.

Le problème n'est pas la formule, qui tient en une ligne. Il est dans ce qu'on
fait des trous.

## La formule, pour mémoire

Le TRS est le produit de trois taux :

```
TRS  =  disponibilité  ×  performance  ×  qualité
```

- **Disponibilité** : temps de marche divisé par temps d'ouverture.
- **Performance** : pièces réellement produites divisées par pièces
  théoriquement productibles pendant le temps de marche.
- **Qualité** : pièces bonnes divisées par pièces produites.

Un TRS de 65 % sur une machine qui tourne huit heures signifie que vous avez
produit ce que vous auriez produit en cinq heures et douze minutes de
fonctionnement parfait.

## Les trois signaux à lire

Vous n'avez pas besoin d'une commande numérique ouverte, ni d'un module par
marque. Trois signaux suffisent, et la plupart des machines les fournissent déjà.

### Le drapeau de marche

Un booléen : la machine produit, ou elle ne produit pas.

Sur une machine récente, il se lit dans un registre Modbus ou un bit d'état.
Sur une machine ancienne, il se prend au bornier : un contact sec de cycle
automatique, un relais de puissance broche, ou le voyant vert de la colonne
lumineuse. Un petit module d'entrées Modbus le relève pour le prix d'un
composant d'armoire.

Attention au signal choisi. « Sous tension » n'est pas « en production » : une
machine allumée qui attend un opérateur n'est pas en marche. Prenez le signal le
plus proche du cycle réel.

### Le compteur de pièces

Un entier qui s'incrémente à chaque pièce terminée. Souvent disponible dans un
registre de la commande, sinon reconstitué par un capteur en sortie ou par le
compteur de cycles de la presse.

Le point délicat est le débordement : un compteur sur 16 bits repasse à zéro à
65 535. La supervision doit reconnaître ce retour à zéro comme un débordement et
non comme une remise à zéro manuelle, sinon votre production journalière devient
négative.

### Le compteur de rebuts

Le même mécanisme, sur les pièces déclarées non conformes. C'est le signal le
plus souvent absent, et souvent le plus facile à ajouter : un bouton de
déclaration au poste, relié à la même carte d'entrées.

Sans lui, vous calculez un TRS à deux facteurs et vous devez le dire, plutôt que
d'afficher 100 % de qualité par défaut.

## Le vrai sujet : que faire quand la donnée manque

C'est ici que la plupart des calculs deviennent faux, et c'est ce qui distingue
un indicateur exploitable d'un chiffre décoratif.

Une liaison se coupe. Un automate redémarre. Un sous-compteur cesse d'émettre
pendant onze minutes. Pendant ce temps, votre supervision n'a **aucune idée** de
ce que faisait la machine.

Trois attitudes possibles, et une seule est défendable :

- **Compter en marche.** C'est ce que fait un tableur qui interpole. Vous
  gonflez votre TRS avec du temps que personne n'a mesuré.
- **Compter en arrêt.** C'est l'inverse : vous punissez la machine d'une panne
  de réseau, et l'atelier cesse de croire à l'indicateur.
- **Compter à part.** C'est la seule réponse honnête : un troisième compteur,
  le temps inconnu, qui n'est ni de la marche ni de l'arrêt.

Un TRS calculé avec un temps inconnu affiché à côté est un TRS dont on peut
discuter. Un TRS calculé sans lui est un TRS auquel il faut croire.

En pratique, si votre temps inconnu dépasse quelques pour cent du temps
d'ouverture, ce n'est pas votre production qui a un problème, c'est votre
acquisition. Et c'est une information en soi.

## Les micro-arrêts, ceux qui n'existent pas

Un arrêt de quatre minutes ne se déclare pas. Personne ne remplit une fiche pour
quatre minutes, et à la fin de la semaine personne ne s'en souvient.

Cumulés, ils pèsent souvent plus que les pannes déclarées. Sur une ligne qui
subit vingt micro-arrêts par jour à trois minutes, ce sont une heure de
production par jour qui disparaissent des statistiques, soit environ
douze pour cent de disponibilité qu'aucun rapport ne mentionne.

Le drapeau de marche les voit tous, à condition qu'on les compte séparément.
Classer les arrêts en deux familles selon un seuil de durée, réglé machine par
machine, transforme un chiffre global en diagnostic :

- **arrêts longs** : les pannes, les changements de série, les attentes matière.
  Ils sont déjà connus.
- **micro-arrêts** : les bourrages, les reprises, les attentes courtes. Ils ne le
  sont jamais.

Un quatrième compteur mérite d'exister : les **arrêts non classés**, ceux dont
la fin n'a pas pu être observée parce que la liaison est tombée pendant. Les
compter plutôt que les deviner.

## Ce que la supervision doit accumuler

Le calcul du TRS ne se fait pas sur la série brute. Il se fait sur des
compteurs, entretenus en continu, qu'on interroge ensuite sur n'importe quelle
période.

Pour un drapeau de marche, sept compteurs :

| Compteur | Ce qu'il porte |
|---|---|
| Temps de marche | Temps cumulé où la machine produit |
| Temps d'arrêt | Temps cumulé à l'arrêt |
| Temps inconnu | Temps où l'entrée n'était pas concluante |
| Arrêts | Nombre d'arrêts observés |
| Micro-arrêts | Arrêts plus courts que le seuil réglé |
| Arrêts longs | Arrêts plus longs que le seuil |
| Arrêts non classés | Arrêts dont la fin n'a pas été observée |

Pour un compteur de pièces, trois : le total, le nombre de remises à zéro, et le
temps inconnu.

Ces compteurs sont enregistrés à intervalle fixe, une valeur par minute. Un TRS
sur un poste, une journée, une semaine ou un mois devient alors une soustraction
entre deux dates, et non un recalcul sur des millions de lignes.

## Rendre les chiffres comparables

Deux équipes qui affichent 72 % et 61 % ne se comparent que si les deux chiffres
sont calculés pareil. Trois points à fixer par écrit, une fois :

1. **Le temps d'ouverture.** Les pauses sont-elles dedans ? Le nettoyage de fin
   de poste ? Le changement de série ?
2. **Le seuil de micro-arrêt**, en secondes, par machine. Trois minutes sur un
   centre d'usinage, trente secondes sur une ligne de conditionnement.
3. **La cadence théorique**, celle qui sert au facteur de performance. Celle du
   constructeur, ou celle du meilleur poste observé, mais la même pour tous.

Ces trois réglages appartiennent au service méthodes, pas à l'outil. Ce que
l'outil doit garantir, c'est qu'ils sont écrits quelque part, datés, et qu'on
sait qui les a changés le jour où le TRS bouge de cinq points sans raison.

## Le raccordement, en pratique

Une machine, trois points Modbus, et le reste est du réglage :

```
Registre 40001, bit 0   →  marche          (booléen)
Registre 40010, 32 bits →  pièces bonnes   (entier)
Registre 40012, 32 bits →  pièces rebutées (entier)
```

Sur une machine sans interface, remplacez le premier par une entrée du module
d'armoire, et les deux autres par les compteurs du poste. Le calcul ne change
pas.

Comptez une demi-journée par machine pour le raccordement et le réglage, et une
semaine de fonctionnement avant de regarder le premier chiffre. Un TRS calculé
sur trois jours ne dit rien : il faut au moins une semaine complète pour que les
changements de série et les samedis prennent leur place.
