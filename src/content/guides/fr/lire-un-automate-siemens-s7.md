---
title: "Lire un automate Siemens S7 et historiser les valeurs en vingt minutes"
description: "Châssis, emplacement, bloc de données, décalage : les quatre nombres qui suffisent pour lire une S7-1500, et le réglage qui bloque neuf tentatives sur dix."
date: 2026-09-07
lang: fr
audience: "Automaticien, technicien de maintenance, intégrateur"
minutes: 9
tags: ["Siemens", "S7", "protocoles", "mise en service"]
---

Lire un automate Siemens sans passer par un serveur intermédiaire prend une
vingtaine de minutes quand on sait où regarder, et une demi-journée quand on ne
le sait pas. La différence tient à un réglage, dans l'automate, que rien
n'indique côté supervision.

Ce guide décrit le chemin complet : ce qu'il faut savoir de l'automate, comment
adresser une valeur, quel réglage débloque la lecture, et à quoi faire attention
ensuite.

## Ce que vous devez obtenir de l'automate

Quatre informations, et rien d'autre.

**L'adresse réseau.** L'automate écoute sur le port 102, celui du protocole
ISO-on-TCP. Il n'y a rien à activer sur les gammes récentes : ce port répond dès
que l'automate est en réseau.

**Le châssis et l'emplacement**, souvent appelés rack et slot. Ce sont deux
petits entiers qui désignent physiquement le processeur dans son rack. Les
valeurs habituelles :

| Gamme | Châssis | Emplacement |
|---|---|---|
| S7-1200 et S7-1500 | 0 | 1 |
| S7-300 | 0 | 2 |
| S7-400 | 0 | 2 ou 3 selon la configuration |

Si vous ne savez pas, essayez `0 / 1` puis `0 / 2`. Un mauvais couple donne une
erreur de connexion immédiate et sans dégât.

**Le numéro du bloc de données** qui contient vos valeurs. Dans un projet
Siemens, c'est le DB : `DB12`, `DB100`. Le programmeur de l'automate le connaît,
et il figure dans l'arborescence du projet.

**Le plan du bloc** : pour chaque valeur, son décalage en octets depuis le début
du bloc, et son type.

## Adresser une valeur

Une valeur S7 se désigne par trois nombres : le bloc, le décalage, le type.

```
DB 12, décalage 0,  type real    →  pression réseau, en bar
DB 12, décalage 4,  type real    →  débit d'air, en m³/h
DB 12, décalage 8,  type int16   →  taux de charge, en %
DB 12, décalage 10, bit 0, bool  →  compresseur en marche
```

Le décalage est en **octets**, pas en variables. Un `real` occupe quatre octets,
un `int16` deux, un `bool` un bit dans un octet. C'est la source d'erreur la plus
fréquente : compter les variables au lieu des octets décale tout ce qui suit.

Les types courants et leur taille :

| Type S7 | Taille | Ce que c'est |
|---|---|---|
| `bool` | 1 bit | Un état, dans un octet dont on précise le bit |
| `byte` | 1 octet | Un entier de 0 à 255 |
| `int16` / `uint16` | 2 octets | Un entier signé ou non |
| `int32` / `uint32` | 4 octets | Un entier long |
| `real` | 4 octets | Un flottant IEEE 754, le type le plus courant |

Pour lire le plan d'un bloc dans le projet Siemens, ouvrez le bloc de données et
affichez la colonne des décalages. Si elle est vide, c'est que vous êtes dans le
cas suivant.

## Le réglage qui bloque tout : l'accès optimisé

Voici la raison pour laquelle neuf premières tentatives sur dix échouent, avec
une erreur qui ne l'explique pas.

Depuis les S7-1200 et S7-1500, Siemens a introduit **l'accès optimisé aux
blocs**. Il est activé par défaut sur tout bloc nouvellement créé. Dans ce mode,
l'automate range les variables comme il l'entend, sans adresse fixe, pour
optimiser sa mémoire. Les variables n'ont alors **plus de décalage** : elles
n'existent que par leur nom, à l'intérieur du programme.

Une lecture par bloc et décalage devient impossible, puisqu'il n'y a plus de
décalage.

Deux solutions, dans l'ordre de préférence :

**Désactiver l'accès optimisé sur le bloc concerné.** Dans les propriétés du
bloc de données, décochez « Accès au bloc optimisé ». Les variables reçoivent
alors des décalages fixes, visibles dans la colonne de décalage, et la lecture
externe fonctionne. Cela demande une recompilation et un rechargement de
l'automate, donc un arrêt de programme : à planifier.

**Créer un bloc de données dédié, non optimisé**, dans lequel le programme
recopie les valeurs à exposer. C'est plus propre : le reste du programme garde
l'optimisation, et vous obtenez une interface stable, dont vous maîtrisez le
plan. C'est la solution à privilégier sur une installation en service.

Une troisième option existe sur les gammes récentes, l'activation du [serveur OPC
UA](/fr/guides/exposer-ses-donnees-en-opc-ua/) embarqué. Elle évite la question du bloc, mais elle est souvent payante et
demande une licence sur la commande. Comparez son devis au coût d'un bloc dédié
avant de la choisir.

## Vérifier avant de configurer cent points

Deux vérifications, dans cet ordre.

**La connexion.** Configurez un seul point, sur une valeur dont vous connaissez
l'ordre de grandeur. Une pression, une température : quelque chose dont vous
saurez dire si le nombre est plausible.

**Le type.** Si votre valeur affiche un nombre absurde, entier gigantesque ou
flottant minuscule, ce n'est pas la connexion qui est en cause, c'est le type ou
le décalage. Un `real` lu comme un `int32` donne un entier à sept chiffres ; un
décalage faux de deux octets donne un nombre sans rapport.

Ne configurez le reste qu'une fois ces deux points validés.

## La cadence, et pourquoi ne pas la pousser

Un automate S7 répond vite, et la tentation est de lire toutes les cent
millisecondes. C'est presque toujours inutile et parfois nuisible.

La cadence se règle sur ce que mesure le point, pas sur ce que la liaison
supporte :

- une température de fluide bouge en minutes : une lecture toutes les cinq à
  trente secondes suffit,
- une pression réseau bouge en secondes : une lecture par seconde,
- un drapeau de marche doit voir un micro-arrêt : une lecture par seconde,
  parfois deux,
- un compteur de pièces : une lecture par seconde, il ne recule jamais.

Une cadence de 750 millisecondes sur une dizaine de points est un réglage
courant et confortable pour un automate en service. Au-delà, vous chargez le
processeur de l'automate pour enregistrer du bruit.

## Après la lecture : ce qui compte vraiment

Lire une valeur est la partie facile. Ce qui donne de la valeur à
l'installation, c'est ce qui vient après.

**La qualité de la donnée.** Une supervision doit distinguer une valeur lue à
l'instant d'une valeur figée depuis dix minutes parce que la liaison est tombée.
Sans cette distinction, une valeur morte ressemble exactement à une valeur
saine, et vos [alarmes concluent sur un fossile](/fr/guides/alarmes-severites-hysteresis-acquittement/).

**La politique d'enregistrement.** Enregistrer chaque lecture d'un point stable
remplit la base sans rien apprendre. Enregistrer sur variation, avec une bande
morte, garde la même information pour une fraction du volume. Réservez
l'enregistrement à intervalle fixe aux points dont vous devez pouvoir prouver
la continuité.

**Le rattrapage après coupure.** Si le réseau tombe entre l'automate et la
supervision, les valeurs de la coupure sont perdues, et c'est normal. Mais si la
coupure est entre la supervision et sa base de données, rien ne doit être
perdu : les valeurs doivent être mises en attente et rejouées dans l'ordre au
rétablissement.

## Récapitulatif

1. Obtenez l'adresse, le châssis, l'emplacement.
2. Obtenez le numéro de bloc et le plan des décalages.
3. Vérifiez que l'accès optimisé est désactivé sur ce bloc, ou faites créer un
   bloc dédié qui ne l'est pas.
4. Configurez un point, vérifiez sa plausibilité.
5. Configurez le reste, réglez les cadences sur le phénomène.
6. Vérifiez que la qualité de donnée remonte à l'arrêt de l'automate.

Le point 3 est celui qui coûte une demi-journée à ceux qui l'ignorent. Les cinq
autres prennent vingt minutes.
