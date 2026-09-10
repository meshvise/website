---
title: "Connecter Power BI à un historique industriel sans intermédiaire"
description: "Trois voies pour alimenter un outil décisionnel depuis une supervision, ce que change une base standard, et les quatre pièges qui font mentir un rapport."
date: 2026-09-02
lang: fr
audience: "Contrôleur de gestion industriel, responsable informatique, analyste"
minutes: 9
tags: ["décisionnel", "Power BI", "SQL", "intégration"]
---

Un responsable de site veut croiser sa consommation d'énergie avec ses volumes
produits. Les deux existent : l'un dans la supervision, l'autre dans l'outil de
gestion. Les réunir devrait prendre une journée.

Dans la plupart des installations, cela prend des mois, ou n'arrive jamais. Non
parce que le croisement est difficile, mais parce que sortir les données de la
supervision l'est.

Ce guide décrit les trois voies possibles, ce qui les distingue, et les pièges
qui font qu'un rapport techniquement juste raconte quelque chose de faux.

## Les trois voies

### Le connecteur propriétaire

L'éditeur de la supervision vend un module qui expose les données à l'outil
décisionnel. C'est la voie la plus confortable et la plus chère : le module se
facture, souvent par serveur, parfois par utilisateur, et il n'expose que ce que
l'éditeur a décidé d'exposer.

Son vrai coût n'est pas le prix du module. C'est qu'il vous lie : le jour où
vous changez d'outil décisionnel, ou de supervision, le connecteur ne suit pas.

### L'export intermédiaire

Un fichier tabulé généré chaque nuit, déposé sur un partage, repris par l'outil
décisionnel au matin.

C'est la solution que tout le monde finit par bricoler, et elle fonctionne. Elle
a trois défauts qu'on découvre à l'usage : elle est décalée d'une nuit, elle
casse silencieusement quand le partage change de nom, et personne ne s'aperçoit
qu'elle a cessé de tourner avant que quelqu'un remarque un rapport figé.

### La connexion directe à la base

L'outil décisionnel se connecte à la base de la supervision, en lecture seule,
et interroge directement.

Rien à installer, rien à planifier, rien à surveiller. C'est la voie la plus
simple **quand elle est possible**, et elle ne l'est que si deux conditions sont
réunies : la base est une base standard, et son schéma est documenté.

C'est la différence de fond entre deux supervisions. L'une stocke ses mesures
dans des blocs binaires compressés dont seul son moteur connaît le format ;
l'autre les stocke dans des tables que n'importe quel outil sait lire.

## Ce que vous devez connaître du modèle

Une base de séries temporelles industrielle tient en trois notions, quelle que
soit la supervision.

**La table des points.** Un identifiant, un nom, une unité, l'équipement
d'origine. C'est le dictionnaire, et c'est par lui qu'on commence toujours.

**La table des mesures.** Un horodatage, un identifiant de point, une valeur,
et si la supervision est sérieuse, une qualité. C'est la table volumineuse :
plusieurs millions de lignes par an et par centaine de points.

**La hiérarchie.** Le rattachement d'un point à une machine, d'une machine à une
ligne, d'une ligne à un site. C'est ce qui permet d'agréger par atelier sans
écrire une liste de points à la main.

Un modèle de rapport qui reprend ces trois tables se construit en une heure.

## Import ou requête directe

Le choix se pose dans tout outil décisionnel, et il se tranche sur le volume.

**En mode import**, l'outil copie les données dans son propre moteur. Rapide à
l'usage, rafraîchi selon une planification. C'est le bon mode pour du reporting
de gestion : un rapport mensuel n'a pas besoin de la mesure de la minute.

**En mode requête directe**, chaque interaction déclenche une requête sur la
base. Toujours à jour, mais chaque clic coûte une requête, et un utilisateur qui
promène un curseur sur une année de données peut faire souffrir la base de
production.

La règle pratique : **importez des agrégats, interrogez directement les
détails**. Un rapport qui affiche des moyennes horaires sur trois ans importe
quelques dizaines de milliers de lignes, pas cent millions.

## Les quatre pièges

### 1. Agréger avant d'importer

L'erreur la plus coûteuse consiste à importer la mesure brute pour la moyenner
ensuite dans l'outil décisionnel. Vous déplacez des dizaines de millions de
lignes sur le réseau pour en afficher trois cents.

L'agrégation doit se faire dans la base, qui est faite pour ça. Une requête qui
moyenne par heure sur un an rend 8 760 lignes, et la base la calcule en quelques
secondes.

### 2. Moyenner ce qui ne se moyenne pas

Toutes les grandeurs ne s'agrègent pas de la même façon, et c'est la source
d'erreur la plus fréquente dans les rapports industriels.

| Nature de la valeur | Agrégation correcte |
|---|---|
| Une température, une pression | Moyenne, minimum, maximum |
| Un index d'énergie, qui ne fait que croître | Différence entre fin et début de période |
| Un compteur de pièces | Différence, en tenant compte des remises à zéro |
| Un état de marche | Temps cumulé dans l'état, pas moyenne du booléen |

La moyenne d'un index d'énergie n'a aucun sens et donne pourtant un nombre, ce
qui est le pire des cas : personne ne s'aperçoit de rien.

### 3. Ignorer la qualité de la donnée

Si votre supervision marque les valeurs issues d'une liaison coupée, votre
rapport doit les exclure. Sinon vous moyennez des valeurs figées avec des
mesures réelles, et vous obtenez une courbe lissée qui ne s'est jamais produite.

Filtrez sur la qualité dès la requête, et affichez à côté le pourcentage de
données écartées. Un indicateur calculé sur 80 % de données valides reste utile,
à condition qu'on le sache.

### 4. Les fuseaux horaires

Une base industrielle stocke en temps universel, un outil décisionnel affiche en
heure locale, et un exploitant raisonne en heures de poste.

Trois conversions possibles, donc trois occasions de décaler un rapport d'une
heure sans que rien ne le signale. Le symptôme classique : une consommation
nocturne qui semble commencer à vingt-trois heures et se terminer à sept.

Fixez la règle une fois : la base en temps universel, la conversion en heure
locale au moment de l'affichage, jamais avant.

## La requête qui sert de point de départ

Le motif utile, qu'il faut adapter au schéma de votre supervision, tient en une
requête : une agrégation par heure, filtrée sur la qualité, pour une liste de
points.

```sql
SELECT
    date_trunc('hour', ts)          AS heure,
    p.name                          AS point,
    avg(h.value)                    AS moyenne,
    min(h.value)                    AS minimum,
    max(h.value)                    AS maximum,
    count(*)                        AS mesures
FROM point_history h
JOIN points p ON p.id = h.point_id
WHERE h.ts >= now() - interval '90 days'
  AND h.quality = 'good'
  AND p.name IN ('COMP1/AirFlow', 'METAIR/Power')
GROUP BY 1, 2
ORDER BY 1;
```

Trois choses la rendent utilisable : elle agrège dans la base, elle filtre sur la
qualité, et elle nomme explicitement les points plutôt que de tirer toute la
table.

## Le compte de lecture

Quelle que soit la voie choisie, une règle : l'outil décisionnel se connecte avec
un compte **en lecture seule**, distinct du compte applicatif.

Ce n'est pas une précaution théorique. Un analyste qui explore une base de
production finira un jour par lancer une requête sans filtre de date sur la table
des mesures. Avec un compte en lecture seule et une limite de durée, il ralentit
la base quelques secondes. Sans, il peut faire bien pire.

## Ce qu'il faut demander avant de choisir une supervision

Si vous n'avez pas encore choisi, trois questions décident de la facilité de
toute intégration future :

1. **Les mesures sont-elles dans une base standard ?** Postgres, SQL Server,
   n'importe quel moteur que vos outils savent lire.
2. **Le schéma est-il documenté ?** Une base standard au schéma secret ne vaut
   pas mieux qu'un format propriétaire.
3. **Un accès en lecture est-il prévu, ou faut-il acheter un module ?**

Une supervision qui répond oui aux trois vous laisse choisir votre outil
décisionnel aujourd'hui, et en changer dans cinq ans sans rien renégocier.
