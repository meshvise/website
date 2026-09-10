---
title: "Sortir d'une supervision en fin de support sans perdre l'historique"
description: "Quatre voies pour récupérer des années de mesures avant l'extinction, ce qu'il faut extraire en plus des valeurs, et comment vérifier que la reprise est fidèle."
date: 2026-09-03
lang: fr
audience: "Responsable informatique industrielle, responsable maintenance, intégrateur"
minutes: 10
tags: ["migration", "historique", "réversibilité", "fin de support"]
---

Une supervision arrive en fin de support. Le serveur tourne encore, la licence
aussi, mais l'éditeur a annoncé une date, ou la version ne fonctionnera plus sur
le prochain système d'exploitation.

La question urgente n'est pas de choisir le remplaçant. Elle est de savoir ce
que vous emportez, parce que **les années de mesures déjà enregistrées ne se
recréent pas**. Une configuration se refait en trois semaines ; un historique de
sept ans ne se refait jamais.

Ce guide décrit comment récupérer cet historique, dans quel ordre s'y prendre, et
comment vérifier que la reprise est fidèle.

## Commencez par l'inventaire, pas par la migration

Avant toute extraction, écrivez trois listes. Elles prennent une demi-journée et
évitent de découvrir un manque après l'extinction du serveur.

**La liste des points.** Nom, unité, équipement d'origine, et surtout : lesquels
sont réellement exploités. Une supervision de dix ans porte toujours des
centaines de points créés pour un essai et jamais supprimés. Les migrer coûte du
temps et pollue le nouveau système.

**La liste de ce qui est réglementaire.** Quels points doivent être conservés,
combien de temps, pour quel référentiel. C'est ce qui décide de ce qui doit être
extrait intégralement plutôt qu'échantillonné.

**La liste de ce qui dépend de la supervision.** Un rapport qui part chaque
lundi, un tableau de bord affiché en atelier, un export vers la comptabilité, un
automatisme déclenché par une alarme. Chacun est une reprise à prévoir, et
chacun est oublié au moins une fois.

## Les quatre voies de sortie

Dans l'ordre de préférence, parce que la première n'est pas toujours disponible.

### 1. L'accès direct à la base

Si votre supervision stocke dans une base de données que vous pouvez interroger,
c'est la meilleure voie : complète, exacte, et vous maîtrisez le rythme.

Vérifiez deux points avant de vous en réjouir :

- **Le modèle est-il lisible ?** Certaines supervisions stockent les valeurs dans
  des tables normalisées et compréhensibles. D'autres les rangent dans des blocs
  binaires compressés, dont seul le logiciel connaît le format. Dans ce second
  cas, l'accès à la base ne vous donne rien.
- **Les identifiants sont-ils résolvables ?** Une table de mesures qui référence
  des points par un entier suppose une table de correspondance. Extrayez-la en
  premier, avant tout le reste : sans elle, vos milliards de lignes n'ont plus
  de sens.

### 2. L'export natif du logiciel

La plupart des supervisions savent exporter en fichier tabulé, par point et par
période. C'est fiable, et c'est lent.

Deux limites à anticiper. Beaucoup d'outils **plafonnent le nombre de lignes**
par export, ce qui vous oblige à découper en tranches et à les recoller. Et
l'export applique souvent une **compression** ou une décimation : vous n'obtenez
pas la donnée brute mais une version allégée, sans que rien ne le signale.

Vérifiez ce point sur une journée connue : comptez les lignes exportées et
comparez au nombre de mesures attendues.

### 3. L'interface OPC HDA

Certaines supervisions exposent leur historique par OPC HDA, l'interface d'accès
aux données historiques. Quand elle existe, elle est propre : elle rend des
valeurs horodatées avec leur qualité, ce que les exports tabulés perdent
souvent.

Elle est en revanche lente sur de gros volumes, et suppose un client capable de
la parler. Comptez-la comme une bonne option pour quelques centaines de points,
pas pour cent mille.

### 4. La conservation du serveur en lecture

Quand rien d'autre n'est possible, la dernière voie consiste à garder l'ancienne
installation, sortie du réseau, allumable pour consultation.

C'est un aveu d'échec, mais c'est parfois la seule réponse à une obligation
réglementaire. Si vous en arrivez là, gardez aussi **une machine capable de
faire tourner ce logiciel** : une image de machine virtuelle avec son système
d'exploitation d'époque vaut mieux qu'un espoir sur du matériel de 2015.

## Ce qu'il faut extraire en plus des valeurs

C'est l'erreur classique : on extrait les mesures et on oublie tout le reste, qui
donne leur sens aux mesures.

**Les unités et les échelles.** Une colonne de nombres sans unité ne vaut rien.
Si la supervision applique un facteur d'échelle entre la valeur brute de
l'automate et la valeur affichée, notez-le : vous devrez le reproduire.

**La qualité.** Si la source distingue une valeur mesurée d'une valeur figée ou
douteuse, gardez cette information. C'est elle qui permettra plus tard de
distinguer un arrêt réel d'une panne de réseau.

**Les seuils d'alarme et leur historique.** Les valeurs seules ne disent pas
quelles limites s'appliquaient à l'époque. En audit, c'est exactement ce qu'on
vous demandera.

**Le journal des alarmes.** Les déclenchements, les acquittements, les auteurs.
C'est de la preuve, et c'est souvent stocké ailleurs que les mesures.

**Les fuseaux horaires et les changements d'heure.** Le piège le plus vicieux.
Si l'ancienne base stocke en heure locale, vous avez deux fois deux heures du
matin fin octobre, et une heure manquante fin mars. Convertissez tout en temps
universel à l'extraction, et notez ce que vous avez fait.

## Vérifier que la reprise est fidèle

Ne déclarez jamais une migration réussie sur la foi d'un import qui ne s'est pas
plaint. Trois contrôles, sur des données que vous connaissez.

**Le comptage.** Pour trois points et trois journées choisies, comparez le nombre
de mesures dans l'ancien et le nouveau système. Un écart de quelques lignes
signale une conversion d'horodatage ; un écart de moitié signale une décimation
silencieuse.

**Les extrêmes.** Pour un mois donné, comparez le minimum, le maximum et la
moyenne d'un point dans les deux systèmes. Trois nombres qui correspondent
valident la chaîne entière, valeurs et échelles comprises.

**Un événement connu.** Prenez un arrêt de production dont vous vous souvenez.
Vérifiez qu'il apparaît au bon horodatage, avec la bonne durée. C'est le test qui
attrape les décalages de fuseau, et aucun autre ne les attrape.

## Le calendrier

Le piège est de commencer trop tard, parce que l'extinction paraît lointaine.

- **Six mois avant** : l'inventaire des trois listes, et le test d'extraction sur
  un point et un mois. C'est ce test qui vous dira laquelle des quatre voies est
  praticable, et il faut le savoir tôt.
- **Trois mois avant** : l'extraction complète, en tranches, avec vérification au
  fur et à mesure. Ne gardez pas une seule copie.
- **Deux mois avant** : le nouveau système tourne **en parallèle** de l'ancien,
  sur les mêmes équipements. C'est la seule façon de comparer deux mesures du
  même instant.
- **Un mois avant** : la reprise des dépendances, rapports et exports compris.
- **Le jour venu** : l'ancien serveur sort du réseau, il ne s'éteint pas. On
  garde la possibilité de le rallumer pendant quelques mois.

Le fonctionnement en parallèle est la partie que tout le monde veut couper pour
gagner du temps, et c'est celle qui rattrape les erreurs.

## Ne pas refaire l'erreur

Une migration coûte cher une fois. Elle coûte cher à chaque fois si le nouveau
système reproduit ce qui a rendu l'ancien difficile à quitter.

Trois questions à poser au prochain fournisseur, avant de signer :

1. **Dans quel format les mesures sont-elles stockées ?** Une base standard au
   schéma documenté est réversible ; un format propriétaire ne l'est pas, quelles
   que soient les intentions de l'éditeur.
2. **Puis-je interroger cette base directement, en lecture ?** Si oui, votre
   historique ne dépend plus du logiciel pour être lu.
3. **Que se passe-t-il à l'expiration de la licence ?** Un système qui bloque
   l'accès aux données en fin d'abonnement transforme un désaccord commercial en
   perte de patrimoine.

Ces trois réponses valent plus que n'importe quelle liste de fonctions. Une
supervision se choisit aussi sur la façon dont on en sort.
