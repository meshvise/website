---
title: "Détecter une fuite d'air comprimé avec trois compteurs"
description: "Le talon de consommation nocturne se voit en une semaine de mesure, se chiffre en euros, et se répare un samedi. Voici comment le mesurer et comment le calculer."
date: 2026-09-09
lang: fr
audience: "Responsable énergie, responsable maintenance, dirigeant de site industriel"
minutes: 8
tags: ["énergie", "air comprimé", "sous-comptage", "ISO 50001"]
---

L'air comprimé est le plus cher des fluides d'atelier, et le seul qu'on laisse
fuir sans le savoir. Il n'est pas visible, il ne tache pas le sol, et un
compresseur qui tourne à vide fait exactement le même bruit qu'un compresseur
qui travaille.

Une fuite ne se découvre donc jamais par hasard. Elle se découvre parce que
quelqu'un a regardé la consommation à une heure où l'atelier était vide.

Ce guide explique quoi mesurer, comment lire le résultat, et comment le
transformer en un nombre que la direction comprend.

## Ce qu'on cherche : un plancher, pas un pic

Une fuite ne produit pas de pic. Elle produit un **plancher** : une
consommation qui ne redescend jamais à zéro, même quand plus rien ne
fonctionne.

C'est ce qui la rend invisible sur une facture mensuelle, et évidente sur une
courbe horaire. Sur une semaine de mesure, un réseau sain dessine cinq bosses de
production, deux jours plats à la valeur de veille, et des nuits à la valeur de
veille. Un réseau qui fuit dessine les mêmes cinq bosses, mais ses nuits et ses
week-ends ne redescendent jamais au même niveau.

Le talon, c'est la différence entre les deux.

## Les trois points à mesurer

Vous n'avez besoin ni d'un audit ni d'un compteur par machine. Trois points
suffisent pour conclure.

### 1. Le débit d'air en sortie de centrale

C'est la mesure directe de ce que le réseau consomme, en mètres cubes par
heure. Un débitmètre à insertion se monte sur la conduite principale, en aval du
sécheur, sans couper le réseau sur la plupart des installations.

C'est le point qui dit **combien** fuit.

### 2. La puissance électrique du compresseur

Un sous-compteur d'énergie sur le départ du compresseur, en kilowatts. C'est ce
qui transforme des mètres cubes en euros, et c'est souvent le seul chiffre qui
intéresse la direction.

C'est le point qui dit **combien ça coûte**.

### 3. La pression réseau

Elle sert de contrôle. Une fuite qui grossit fait légèrement chuter la pression
de service, et le compresseur compense en tournant plus. Si votre talon
augmente pendant que la pression baisse, vous n'avez pas un problème de réglage :
vous avez un trou.

C'est le point qui dit **que c'est bien une fuite**.

Les trois se raccordent en [Modbus TCP](/fr/protocoles/) sur un automate ou une
passerelle d'atelier. Le débitmètre et le compteur d'énergie communicants coûtent quelques
centaines d'euros pièce, et se posent en une matinée.

## Lire le résultat

Après une semaine d'enregistrement, regardez le débit à trois heures du matin un
dimanche. C'est votre plancher réel.

Comparez-le à la consommation de veille attendue de votre installation, celle
que donne la documentation du compresseur ou que vous mesurez réseau fermé.

Voici un exemple chiffré sur un atelier d'usinage de taille moyenne :

| Mesure | Attendu au repos | Observé au repos |
|---|---|---|
| Débit d'air | 45 m³/h | 255 m³/h |
| Puissance compresseur | 4,5 kW | 24 kW |
| Taux de charge | 8 % | 46 % |
| Pression réseau | 7,3 bar | 7,05 bar |

Le talon est donc de **210 m³/h**, soit **19,5 kW** de puissance électrique qui
partent dans des raccords que personne n'entend.

## Le chiffrer, honnêtement

C'est l'étape où la plupart des calculs deviennent contestables, parce qu'ils
comptent la fuite vingt-quatre heures sur vingt-quatre.

Une fuite coule effectivement en permanence, mais pendant les heures de
production, une partie de cet air aurait de toute façon été produite. Le calcul
défendable, celui qu'on peut poser devant un contrôleur de gestion sans se faire
reprendre, ne compte que **les heures où l'atelier est à l'arrêt**.

Sur une semaine de 168 heures dont 70 de production, il reste 98 heures d'arrêt,
soit environ 5 100 heures par an.

```
19,5 kW  ×  5 096 h/an  ×  0,14 €/kWh  =  13 912 € par an
```

Trois nombres, tous vérifiables : la puissance mesurée, les heures hors
production tirées de votre planning, et votre prix du kilowattheure.

Ce chiffrage est volontairement bas. Compter les 8 760 heures de l'année
donnerait environ 29 400 €, et ce serait défendable aussi. Mieux vaut annoncer
le chiffre que personne ne peut contester.

## La réparer, et prouver que c'est fait

Une recherche de fuite se programme un samedi, réseau sous pression et atelier à
l'arrêt. Un détecteur à ultrasons trouve les raccords fuyards en quelques
heures ; les coupables habituels sont les flexibles d'outillage, les raccords
rapides et les purgeurs bloqués.

L'intérêt d'avoir mesuré avant, c'est de pouvoir mesurer après. Le lundi
suivant, la même courbe, la même heure, le même point : si le plancher est
retombé de 255 à 60 m³/h, l'intervention a payé et vous pouvez le montrer.

C'est aussi ce qui vous protège de la fuite suivante. Un talon qui remonte
lentement pendant trois mois se voit sur une courbe annuelle, et ne se voit
nulle part ailleurs.

## Pourquoi personne ne le fait

Parce que la mesure suppose trois choses que la plupart des ateliers n'ont pas :
un enregistrement continu, une conservation sur plusieurs semaines, et quelqu'un
qui regarde à trois heures du matin.

Les deux premières sont un problème d'outil. La troisième n'en est pas un : on
ne regarde pas à trois heures du matin, on regarde le lendemain la courbe de
trois heures du matin.

C'est exactement ce que fait une supervision : elle enregistre le débit au pas
de trente secondes, elle le garde, et elle vous laisse comparer une nuit de
janvier à une nuit de mars. Le reste est de l'arithmétique.

## Aller plus loin

Une fois le talon sous contrôle, la même mesure sert à trois autres choses :

- **Le rendement spécifique du compresseur**, en kilowattheures par mètre cube.
  Il se dégrade lentement, et c'est un bon indicateur d'entretien.
- **La pression de consigne.** Baisser la pression réseau de 1 bar économise
  environ 7 % de l'énergie du compresseur. Encore faut-il vérifier qu'aucun
  poste n'en souffre, ce que seule une mesure continue permet.
- **Le dossier ISO 50001**, si vous êtes engagé dans une démarche énergie. Un
  historique de consommation par usage est exactement la preuve que demande
  l'audit, et le sous-comptage divisionnaire en est le socle. Le guide sur la
  [préparation d'un audit](/fr/guides/preparer-un-audit-qualite/) détaille ce qu'un
  auditeur cherche vraiment.

Trois compteurs, une semaine de mesure, et un calcul à trois termes. C'est le
meilleur rapport entre ce que ça coûte et ce que ça rapporte de tout ce qu'on
peut instrumenter dans un atelier.
