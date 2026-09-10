---
title: "Ce que coûte réellement une supervision à cinq mille points sur cinq ans"
description: "Onze postes de coût, dont sept n'apparaissent pas dans le devis initial, et la méthode pour comparer deux offres qui ne se facturent pas de la même façon."
date: 2026-09-01
lang: fr
audience: "Dirigeant de site, contrôleur de gestion industriel, acheteur"
minutes: 11
tags: ["coût total", "achat", "licences", "budget"]
---

Un devis de supervision annonce un nombre. Ce nombre est presque toujours le
plus petit des onze que vous paierez sur cinq ans.

Ce n'est pas une manœuvre : c'est la conséquence d'un mode de facturation où le
prix dépend de choses que personne ne connaît au moment du devis, à commencer
par le nombre de points que le site comptera dans trois ans.

Ce guide liste les onze postes, explique lesquels échappent au devis initial, et
donne une méthode pour comparer deux offres qui ne se facturent pas de la même
façon.

## Les onze postes

### Ce qui figure au devis

**1. La licence initiale.** Le droit d'utiliser le logiciel, souvent
dimensionné par le nombre de points, parfois par serveur, parfois par
utilisateur simultané.

**2. La mise en service.** L'installation, le raccordement des premiers
équipements, la formation. Compter entre quelques jours et quelques semaines
selon la taille du parc.

**3. Le matériel.** Un serveur, ou une machine virtuelle sur l'infrastructure
existante. Une supervision de cinq mille points ne demande pas grand-chose :
quelques cœurs, seize gigaoctets de mémoire, un disque rapide.

### Ce qui n'y figure pas

**4. La maintenance annuelle.** Entre quinze et vingt-cinq pour cent de la
licence initiale, chaque année, pour recevoir les correctifs et le droit de
monter de version. Sur cinq ans, ce poste dépasse souvent la licence elle-même.

**5. Les extensions de points.** C'est le poste qui surprend le plus. Un site
qui démarre à cinq mille points en compte sept mille trois ans plus tard, parce
qu'on a instrumenté deux lignes de plus. Chaque tranche se rachète, au tarif du
moment, et sans pouvoir de négociation puisque le système est en place.

**6. Les modules par protocole.** Beaucoup de supervisions facturent
séparément le pilote de chaque famille d'automates. Ajouter une marque d'automate
au parc devient alors un achat, pas une configuration.

**7. Les postes clients.** Certains modèles facturent chaque écran d'exploitation
ou chaque utilisateur nommé. Un poste ajouté en salle de contrôle est une ligne
de commande.

**8. Le connecteur décisionnel.** Le module qui expose les données à un outil de
reporting, quand la base n'est pas directement interrogeable.

**9. Les montées de version majeures.** La maintenance couvre les correctifs ;
un changement de version majeure demande souvent une prestation, parfois une
remise à niveau de la licence.

**10. Le temps interne.** Le plus gros poste, et celui qu'aucun devis ne
mentionne. Quelqu'un configure, quelqu'un forme, quelqu'un dépanne. Comptez
plusieurs jours par an, chargés.

**11. La sortie.** Le coût de récupérer ses données le jour où l'on change. Il
est nul si la base est standard et documentée, et il se chiffre en semaines dans
le cas contraire : le guide sur la [sortie d'une supervision](/fr/guides/sortir-d-une-supervision-en-fin-de-support/)
décrit les quatre voies possibles.

## Le tableau à remplir

Comparer deux offres suppose de les ramener au même horizon. Voici la grille,
avec les questions à poser pour chaque ligne.

| Poste | La question à poser au fournisseur |
|---|---|
| Licence initiale | À quoi le prix est-il indexé, et que se passe-t-il si ce nombre double ? |
| Maintenance annuelle | Quel pourcentage, révisable comment, et qu'est-ce qu'elle couvre exactement ? |
| Extension de points | Quel est le prix de la tranche suivante, par écrit, aujourd'hui ? |
| Protocoles | Lesquels sont inclus, lesquels se facturent, et combien ? |
| Postes clients | Le prix dépend-il du nombre d'écrans ou d'utilisateurs ? |
| Accès décisionnel | Puis-je lire la base directement, ou faut-il un module ? |
| Montées de version | Une version majeure est-elle incluse dans la maintenance ? |
| Matériel | Quelles ressources pour mon nombre de points et ma rétention ? |
| Mise en service | Combien de jours, et que couvrent-ils précisément ? |
| Temps interne | Combien de jours par an chez vos clients comparables ? |
| Sortie | Dans quel format sont les mesures, et puis-je les extraire seul ? |

Les deux lignes qui font le plus de différence sur cinq ans sont l'extension de
points et la maintenance annuelle. Ce sont aussi les deux qui figurent le moins
souvent dans un devis initial.

## Pourquoi les prix ne sont pas publics

Une remarque de méthode, avant d'aller plus loin.

Vous ne trouverez pas les tarifs des principales supervisions du marché en ligne.
Ils passent par un devis, calculé sur votre parc, votre nombre de points et le
canal par lequel vous arrivez.

Ce n'est pas illégitime : un système déployé sur mille sites ne se vend pas comme
un logiciel de bureau. Mais cela a trois conséquences pratiques pour vous :

- **Vous ne pouvez pas comparer avant de vous engager dans une consultation**, ce
  qui coûte des semaines par fournisseur.
- **Vous ne pouvez pas budgéter** sans avoir déjà fait la moitié du chemin
  commercial.
- **Vous ne savez pas ce que paient les autres**, donc vous ne savez pas si votre
  prix est bon.

D'où l'importance de la question la plus simple, et la plus révélatrice : **quel
est le prix de la tranche de points suivante, par écrit, aujourd'hui ?** Un
fournisseur qui répond en une ligne vous dit beaucoup sur les cinq ans à venir.

## Le point de bascule

Sur un modèle facturé au point, le coût total suit le nombre de points. Sur un
modèle à prix fixe par site, il ne le suit pas.

Il existe donc un nombre de points au-delà duquel le second devient moins cher,
et ce nombre est plus bas qu'on ne l'imagine, parce que le calcul doit inclure
les extensions futures et la maintenance annuelle.

La méthode pour le trouver, sur votre cas :

1. Prenez votre nombre de points actuel, et celui que vous estimez dans cinq ans.
   La plupart des sites sous-estiment cette croissance d'un facteur deux.
2. Calculez le coût du modèle au point sur ces deux valeurs, maintenance
   comprise, sur cinq ans.
3. Comparez à un prix fixe sur la même durée.

Sur une supervision de cinq mille points qui passe à sept mille, avec une
maintenance à vingt pour cent, le modèle au point coûte typiquement plusieurs
fois le prix affiché initialement, et l'écart se creuse chaque année.

## Ce que Meshvise facture, et ce qu'il ne facture pas

Pour être utile, ce guide doit dire d'où il parle.

Meshvise se facture **2 400 € par an et par site**, quel que soit le nombre de
points, de machines ou d'écrans. Les treize protocoles sont inclus, il n'y a pas
de module par marque d'automate, et il n'y a pas de licence par poste client.

La mise en service est chiffrée sur devis, parce que le travail réel dépend du
nombre d'équipements, de leurs protocoles et de la segmentation du réseau.
Annoncer un forfait ici serait une promesse qu'on ne peut pas tenir sur un parc
qu'on n'a pas vu.

Ce que ce modèle ne change pas : le matériel reste à votre charge, et le temps
interne aussi. Un prix fixe ne supprime pas le travail, il supprime la
négociation.

Sur cinq ans, cela fait 12 000 € de licence, plus la mise en service, plus votre
serveur. Trois nombres, dont deux sont connus d'avance, et le détail est sur la
page [tarifs](/fr/tarifs/).

## Trois questions qui valent le reste

Si vous ne devez en poser que trois lors de votre consultation :

**Quel est le prix de la tranche de points suivante ?** Si la réponse demande un
nouveau devis, vous connaissez déjà la nature de la relation.

**Puis-je lire ma base directement, en lecture seule ?** Si oui, votre historique
ne dépend plus du fournisseur pour être exploité, ni pour être récupéré.

**Que se passe-t-il si j'arrête de payer ?** Les réponses vont de « le système
continue en lecture seule et vos données restent accessibles » à « le service
s'arrête ». L'écart entre ces deux réponses est le vrai prix de la dépendance.
