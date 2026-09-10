---
title: "Préparer un audit qualité avec un historique de paramètres"
description: "Un auditeur ne demande pas si vos paramètres étaient bons. Il demande de le prouver, sur une date précise, et c'est là que les classeurs s'effondrent."
date: 2026-09-04
lang: fr
audience: "Responsable qualité, responsable méthodes, préparateur d'audit"
minutes: 9
tags: ["qualité", "audit", "traçabilité", "ISO 9001"]
---

La question que pose un auditeur n'est jamais « vos paramètres sont-ils
maîtrisés ». Elle est : « montrez-moi la température de l'étuve pendant le lot
4417, du 12 mars ».

Cette question fait la différence entre deux ateliers qui font pourtant le même
travail. Le premier ouvre un écran et répond en trente secondes. Le second
demande un délai, ressort des classeurs, retrouve une feuille de relevé où
quelqu'un a noté trois valeurs dans la journée, et espère que l'auditeur s'en
contentera.

Ce guide décrit ce qu'il faut enregistrer pour être dans le premier cas.

## Ce qu'un auditeur vérifie réellement

Trois choses, et une seule concerne les valeurs.

**Que le paramètre était dans sa plage.** C'est la partie facile, et la seule que
les feuilles de relevé couvrent, très imparfaitement.

**Que vous surveilliez.** Une valeur relevée trois fois par jour ne prouve rien
sur les vingt-trois autres heures. Un auditeur exigeant le sait, et un relevé
manuel est toujours attaquable : il prouve qu'à trois instants la valeur était
bonne, pas que le paramètre était maîtrisé.

**Que rien n'a changé sans que vous le sachiez.** C'est le point qui prend tout
le monde de court. Si un seuil d'alarme, une consigne ou une plage de tolérance
a été modifié pendant la période auditée, l'auditeur veut savoir par qui, quand,
et pourquoi. Une supervision qui ne garde pas cette trace transforme une
question simple en enquête.

## Les trois registres à tenir

### 1. L'historique des valeurs

Chaque paramètre critique, enregistré en continu, avec son horodatage et sa
qualité.

Le point sur lequel on se trompe le plus est la **politique
d'enregistrement**. Trois modes existent, et le choix a des conséquences en
audit :

- **Sur variation, avec bande morte.** Une valeur n'est enregistrée que si elle
  a bougé de plus de la bande depuis la dernière. Économique, parfait pour la
  plupart des points, mais il laisse des trous quand rien ne bouge, et un
  auditeur peut lire un trou comme une absence de surveillance.
- **À intervalle fixe.** Une valeur toutes les minutes, quoi qu'il arrive. Plus
  volumineux, et c'est le seul mode qui produit une preuve de continuité.
- **Aucun.** Le point vit à l'écran, il n'entre pas dans l'historique.

**Pour un paramètre auditable, choisissez l'intervalle fixe.** Le coût de stockage
d'une valeur par minute est dérisoire au regard d'une non-conformité, et c'est le
seul mode où vous pouvez affirmer, courbe à l'appui, que la mesure existait à
chaque minute de la période.

### 2. L'historique des alarmes

Chaque déclenchement, chaque acquittement, chaque retour à la normale, avec la
valeur du moment et le nom de la personne qui a acquitté.

Ce registre répond à la question que l'auditeur pose ensuite : « et quand la
température est sortie de la plage, qu'avez-vous fait ? » Un journal en ajout
seul, où chaque événement porte un horodatage et un opérateur identifié, y
répond sans discussion.

Un acquittement anonyme vaut zéro en audit. Vous savez qu'une alarme a été vue,
jamais par qui, donc jamais à qui demander ce qui a été fait. Le guide sur les
[alarmes](/fr/guides/alarmes-severites-hysteresis-acquittement/) détaille la machine
d'état complète.

### 3. L'historique des changements de configuration

C'est le registre qui manque presque partout, et celui qui sauve les audits
difficiles.

Toute modification de la configuration doit entrer dans une révision datée,
signée, et rattachée à la précédente. Un seuil d'alarme resserré, une plage de
tolérance élargie, une temporisation allongée : chacun de ces gestes change ce
que votre système surveille, donc ce que vous pouvez prouver.

Une révision porte au minimum : la date, l'auteur, un message qui dit pourquoi,
et le lien vers la révision précédente. Le tout forme une chaîne qu'on remonte.

## Le cas qui décide de tout : le doute sur un lot

Voici la situation réelle, celle qui arrive une ou deux fois par an.

Un client signale un défaut sur un lot livré il y a six semaines. Vous devez
déterminer si un paramètre a dérivé pendant sa production.

**Sans historique** : vous suspectez tout. Vous ne pouvez ni innocenter ni
incriminer le procédé, donc vous bloquez les lots voisins par précaution, et
vous facturez cette précaution à votre marge.

**Avec un historique de valeurs seul** : vous voyez que la température était dans
la plage. C'est déjà beaucoup. Mais si la plage elle-même a été modifiée entre
temps, vous ne le savez pas, et votre preuve est fausse sans que vous le
soupçonniez.

**Avec les trois registres** : vous affichez la courbe du paramètre sur la
fenêtre du lot, vous vérifiez qu'aucune alarme n'a tiré, et vous vérifiez
qu'aucune révision n'a touché les seuils pendant la période. Les trois réponses
prennent quelques minutes, et elles se citent dans un rapport.

## La question du temps de conservation

Trois durées à ne pas confondre :

**La durée réglementaire**, celle qu'impose votre référentiel ou votre client.
Souvent trois ans, parfois dix dans le médical ou l'aéronautique.

**La durée utile**, celle où l'historique sert à l'exploitation. Trente à
quatre-vingt-dix jours suffisent pour diagnostiquer et régler.

**La durée technique**, celle que votre installation peut porter. Elle dépend du
nombre de points et de la politique d'enregistrement, pas du logiciel.

Un ordre de grandeur pour calibrer : cinq cents points enregistrés à la minute
produisent environ vingt-six millions de lignes par an. Si vous devez un jour
les emporter ailleurs, le guide sur la [sortie d'une supervision](/fr/guides/sortir-d-une-supervision-en-fin-de-support/)
explique comment s'y prendre. C'est modeste pour une
base de séries temporelles moderne, et cela tient sur un disque ordinaire.

La règle pratique : gardez tous les points à la durée utile, et **seuls les
points auditables** à la durée réglementaire. Distinguer les deux familles dès
la conception évite d'avoir à choisir entre tout garder et tout perdre.

## Ce qu'il faut pouvoir sortir devant un auditeur

Quatre extractions, à préparer une fois et à savoir refaire :

1. **La courbe d'un paramètre sur une fenêtre donnée**, avec ses limites
   affichées. C'est la preuve principale.
2. **La liste des alarmes de la période**, avec les acquittements et leurs
   auteurs.
3. **La liste des révisions de configuration** touchant les paramètres concernés,
   sur la période.
4. **L'export brut** des valeurs, dans un format que l'auditeur peut ouvrir
   lui-même. Un fichier tabulé, pas une capture d'écran.

Ce dernier point compte plus qu'on ne croit. Un auditeur qui reçoit une capture
d'écran doit vous croire. Un auditeur qui reçoit un fichier qu'il ouvre dans son
tableur vérifie lui-même, et ce simple fait change la nature de l'échange.

## Le piège de la valeur figée

Un dernier point, technique, qui a une conséquence directe en audit.

Quand la liaison avec un équipement se coupe, la dernière valeur lue reste
souvent affichée. Elle est figée, mais rien ne le montre. Si votre historique
enregistre cette valeur figée comme une mesure, vous produisez une preuve
fausse : une courbe parfaitement plate qui semble démontrer une stabilité
exemplaire, alors qu'elle démontre seulement que plus personne ne mesurait.

Une supervision sérieuse marque ces périodes. Chaque valeur porte une qualité, et
une valeur périmée ou issue d'une liaison coupée est marquée comme telle. La
courbe montre alors un trou, ce qui est la vérité, plutôt qu'une ligne droite,
qui est un mensonge.

Devant un auditeur, un trou daté et expliqué se défend. Une ligne droite dont on
découvre qu'elle était une panne de réseau ne se défend pas.
