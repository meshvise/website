---
title: "Alarmes industrielles : sévérités, hystérésis et acquittement"
description: "Pourquoi une alarme bien réglée tire trois fois par an et pas huit fois par semaine, et comment régler les trois paramètres qui décident de tout."
date: 2026-09-10
lang: fr
audience: "Responsable maintenance, automaticien, chef de projet supervision"
minutes: 9
tags: ["alarmes", "ISA-18.2", "hystérésis", "exploitation"]
---

Une alarme qui tire tous les jours et se referme en six minutes n'informe plus
personne. Elle apprend seulement à ne plus regarder.

C'est le défaut le plus courant des supervisions installées, et il ne vient
presque jamais du logiciel. Il vient de trois paramètres mal réglés, souvent
parce que deux d'entre eux n'existaient pas dans l'outil, et que le troisième a
été posé un jour de mise en service par quelqu'un qui n'avait pas encore vu le
procédé tourner.

Ce guide explique ce que font ces trois paramètres, dans quel ordre les régler,
et comment reconnaître une alarme qui ment.

## Le problème n'est pas le seuil, c'est ce qui l'entoure

Prenons un cas réel, celui d'un groupe froid qui refroidit l'huile de coupe d'un
atelier d'usinage. Sa température de sortie oscille chaque après-midi entre 22,3
et 22,7 °C, comme elle l'a toujours fait. Le procédé va bien.

Quelqu'un règle l'alarme de température haute à 22,5 °C, pour affiner un
réglage. Sur les vingt et un jours suivants, le maximum journalier dépasse
quinze fois ce seuil. L'alarme tire huit fois en onze jours, chaque
déclenchement se refermant tout seul en trois à onze minutes.

Au bout de la troisième, l'équipe a cessé de la lire. Au bout de la huitième,
quelqu'un l'a acquittée avec la mention « seuil probablement trop serré », et
plus personne n'y a touché.

Le procédé n'a jamais eu tort. Ce qui a bougé, c'est le réglage. Et le coût
n'est pas les huit courriels : c'est que cette alarme, désormais, ne servira
plus jamais à rien, y compris le jour où la température montera vraiment.

## Les trois paramètres

### Le seuil

C'est le seul que tout le monde règle, et le seul qui ne suffit jamais.

Un seuil se choisit sur une série, pas sur une intuition. Avant de poser une
valeur, regardez l'histogramme du point sur trente jours : où passe le maximum
journalier habituel, quelle est sa dispersion, à quelle distance se trouve la
valeur qui vous inquiéterait vraiment.

Si votre seuil coupe la distribution normale du procédé, il est trop serré,
quelle que soit sa justification théorique. Une alarme n'est pas une consigne de
régulation.

### L'hystérésis

C'est le paramètre qui manque le plus souvent, et celui qui produit le
clignotement.

Sans hystérésis, une alarme haute se déclenche dès que la valeur dépasse le
seuil, et se referme dès qu'elle repasse en dessous. Sur un signal bruité qui
oscille autour du seuil, cela donne une salve de déclenchements et de retours à
la normale en quelques minutes.

Avec hystérésis, les deux conditions ne sont plus symétriques :

- l'alarme se déclenche quand la valeur dépasse le seuil,
- elle ne se referme que quand la valeur redescend sous le seuil **moins** la
  bande d'hystérésis.

Sur une alarme haute réglée à 24 °C avec une hystérésis de 1 °C, il faut donc
redescendre sous 23 °C pour que l'alarme se referme. Un bruit de mesure de
quelques dixièmes ne peut plus la faire clignoter.

Réglez l'hystérésis sur l'amplitude du bruit de votre mesure, pas sur une
fraction du seuil. Un signal qui bouge de 0,3 °C entre deux lectures demande au
moins 0,5 °C d'hystérésis ; un capteur stable peut se contenter de moins.

### La temporisation

Elle répond à une question différente : combien de temps la condition doit-elle
tenir avant que l'alarme parte.

Une pression qui dépasse son seuil pendant deux secondes au démarrage d'une
pompe n'est pas un défaut, c'est un transitoire. Une temporisation de trente
secondes le laisse passer sans rien signaler, et déclenche si la pression reste
haute.

L'hystérésis traite le bruit **en amplitude**, la temporisation traite le bruit
**en durée**. Les deux ne se remplacent pas, et une alarme correctement réglée a
souvent besoin des deux.

Un ordre de grandeur utile : la temporisation se règle sur la constante de temps
du phénomène surveillé, la même logique qui sert à régler la cadence de lecture
d'un point, décrite dans le guide sur la [lecture d'un automate Siemens S7](/fr/guides/lire-un-automate-siemens-s7/). Quelques secondes pour une pression, une minute pour une
température de fluide, plusieurs minutes pour une température d'ambiance.

## L'ordre dans lequel les régler

1. **Le seuil**, sur une série de trente jours, à distance de la dispersion
   normale du procédé.
2. **L'hystérésis**, sur l'amplitude du bruit de mesure.
3. **La temporisation**, sur la constante de temps du phénomène.
4. **La sévérité**, en dernier, une fois que vous savez à quelle fréquence
   l'alarme tirera réellement.

Régler la sévérité en premier est l'erreur qui produit des paysages d'alarmes
critiques où plus rien n'est critique.

## Les sévérités : trois, pas dix

Une échelle de sévérité ne sert qu'à une chose : décider qui est dérangé, et
quand.

Trois niveaux suffisent, et Meshvise n'en propose pas davantage :

- **information** : une transition qu'on veut voir dans le journal, sans
  déranger personne.
- **avertissement** : quelque chose demande une décision, dans la journée.
- **critique** : quelqu'un se déplace, ou la production s'arrête.

Le test qui tranche : si vous ne pouvez pas nommer la personne qui sera
dérangée et le délai dans lequel elle doit répondre, votre alarme n'est pas
critique. Elle est au mieux un avertissement.

Une échelle à cinq ou six niveaux produit toujours le même résultat : personne
ne sait plus faire la différence entre le niveau trois et le niveau quatre, et
tout le monde règle sur le niveau le plus haut par prudence.

## L'acquittement, et pourquoi il doit être nominatif

Un acquittement dit deux choses : quelqu'un a vu, et cette personne prend la
suite.

Si votre supervision permet d'acquitter sans être identifié, le journal perd la
moitié de sa valeur. Vous savez qu'une alarme a été vue, jamais par qui, donc
jamais à qui poser la question six semaines plus tard.

La séquence complète tient en quatre états, et c'est la norme ISA-18.2 qui la
décrit :

- **normale** : la condition n'est pas remplie.
- **active** : la condition est remplie depuis plus longtemps que la
  temporisation.
- **acquittée** : un opérateur identifié a vu, la condition est toujours là.
- **retour à la normale** : la condition a cessé, hystérésis comprise.

À cela s'ajoute la **mise en veille**, qui est le seul moyen honnête de faire
taire une alarme pendant une intervention. Mettre en veille, c'est déclarer que
l'on connaît cette alarme et qu'on la neutralise jusqu'à une date. Ce n'est pas
la désactiver, et cela laisse une trace.

Toute autre méthode pour faire taire une alarme, désactivation temporaire
comprise, finit par être oubliée en position basse.

## Le journal, et ce qu'on lui demande

Un journal d'alarmes utile est en ajout seul : chaque déclenchement, chaque
acquittement, chaque retour à la normale y entre avec son horodatage, sa valeur
au moment du fait, et le nom de la personne quand il y en a une.

Ce qu'on lui demande, en pratique :

- Combien de fois cette alarme a-t-elle tiré le mois dernier ?
- Quelle était la valeur au moment du déclenchement ?
- Combien de temps s'est écoulé entre le déclenchement et l'acquittement ?
- Qui a acquitté ?

Si votre supervision ne répond pas à ces quatre questions, vous ne pourrez
jamais démontrer qu'une alarme est mal réglée, et vous continuerez donc à
la subir. C'est aussi ce journal qu'un auditeur demandera, comme l'explique le
guide sur la [préparation d'un audit qualité](/fr/guides/preparer-un-audit-qualite/).

## Le cas qui piège tout le monde : une alarme qui conclut sur une valeur morte

Voici le défaut le plus vicieux, et il n'a rien à voir avec le réglage.

Quand la liaison avec un équipement se coupe, la dernière valeur lue reste dans
le cache de la supervision. Elle est figée, mais elle est là. Si le moteur
d'alarmes compare cette valeur figée à son seuil, deux choses peuvent arriver,
et les deux sont fausses :

- une alarme se déclenche sur un chiffre qui date de vingt minutes,
- ou pire, une alarme **se referme** parce que la dernière valeur connue était
  sous le seuil, alors que personne ne sait ce que fait réellement la machine.

La règle est simple : **une alarme ne conclut pas sur une donnée dont la
qualité n'est pas concluante.** Trois qualités interdisent de conclure, parce
qu'elles ne disent pas « cette valeur est douteuse » mais « ce nombre n'est pas
une mesure de maintenant » : liaison coupée, valeur périmée, valeur marquée
invalide par l'équipement.

Une quatrième qualité, l'incertain, n'interdit pas de conclure, et c'est
délibéré. Elle marque une valeur réellement présente dont une entrée de calcul
était douteuse. Geler la surveillance à chaque incertitude désarmerait les
alarmes bien plus souvent que le défaut qu'on cherche à éviter. Entre détecter à
tort et ne plus détecter, une alarme choisit de détecter.

## Ce que ça donne dans Meshvise

Chaque définition d'alarme porte son seuil, sa bande d'hystérésis, sa
temporisation et sa sévérité. La machine d'état suit les quatre états de la
norme, l'acquittement demande un opérateur identifié, et la mise en veille porte
une date de fin.

Chaque transition est enregistrée dans un journal en ajout seul, avec la valeur
et l'horodatage. Aucune alarme ne conclut sur une valeur dont la qualité est
non concluante.

Et toute modification de seuil est une révision datée et signée. C'est ce qui
permet, dans le cas du groupe froid raconté plus haut, de relier la salve de
huit déclenchements à la personne et à la date qui l'ont provoquée, puis de
revenir en arrière en connaissance de cause : seuil à 24 °C, hystérésis à 1 °C.

Le procédé, lui, n'a jamais eu tort.
