---
title: "Brancher un assistant sur sa supervision industrielle"
description: "Pourquoi un modèle branché sur un SCADA ordinaire ne sert à rien, ce que change un référentiel gouverné, et les questions à poser avant de promettre une intégration."
date: 2026-09-11
lang: fr
audience: "Responsable informatique industrielle, DSI, responsable méthodes"
minutes: 11
tags: ["assistant", "MCP", "intégration", "API", "gouvernance"]
---

Une entreprise industrielle a déjà, en 2026, un assistant qui lit ses courriels,
ses documents et souvent sa gestion. Quelqu'un finit toujours par poser la
question évidente : pourquoi pas l'atelier ?

La réponse honnête est que l'atelier est le dernier système qui ne se laisse pas
lire, et que ce n'est pas un problème d'intelligence artificielle. C'est un
problème de référentiel.

## Pourquoi un modèle branché sur un SCADA ordinaire ne sert à rien

Prenez une supervision classique et donnez-en l'accès à un modèle. Voici ce
qu'il reçoit :

```
DB12.DBW4   = 1247
DB12.DBX0.3 = true
TAG_00471   = 62.8
```

Trois valeurs, et rien d'autre. Le modèle ne sait pas ce que mesure `DB12.DBW4`,
ni dans quelle unité, ni si la machine tournait, ni si la liaison était debout au
moment de la lecture. Il ne sait même pas si 1247 est un nombre de pièces, une
température en dixièmes de degré ou un compteur d'heures.

Alors il fait ce qu'un modèle de langage fait toujours quand le contexte manque :
il produit une phrase plausible. « La valeur de 1247 semble indiquer une
production soutenue. » C'est du bavardage, et c'est pire qu'un silence, parce que
la phrase est bien tournée et que quelqu'un va la croire.

**Ce qui manque à ce modèle n'est pas de l'intelligence. C'est un dictionnaire.**

Cinq choses précisément, et aucune ne s'invente au moment de la question :

**Une identité stable.** Un point doit avoir un identifiant qui ne change pas
quand quelqu'un renomme son libellé. Sinon la réponse d'hier ne se recoupe pas
avec celle d'aujourd'hui.

**Un vocabulaire fini.** Les rôles, les unités, les sévérités, les qualités
doivent venir d'une liste gouvernée, pas d'un champ de texte libre. Un modèle qui
choisit dans une liste ne peut pas inventer un filtre ; un modèle devant un champ
libre invente, et récolte une erreur ou pire, un résultat vide qu'il interprète
comme un zéro.

**Une qualité explicite.** Une valeur figée parce que la liaison est tombée doit
se distinguer d'une valeur mesurée. C'est ce qui permet à un assistant de se
taire au lieu de commenter un plateau qui n'existe pas. Le
[guide sur le calcul du rendement](/fr/guides/calculer-un-trs-depuis-des-compteurs-modbus/)
détaille pourquoi ce troisième état change tout.

**Des indicateurs gouvernés.** Le rendement, la disponibilité, le talon
nocturne doivent être calculés par le système, avec leurs bornes et leur taux de
couverture, et non recalculés par le modèle à partir d'une série brute.

**Un historique des changements.** Sans lui, un assistant voit une alarme
disparaître et conclut que le problème est réglé, alors que quelqu'un a desserré
le seuil.

## La règle qui rend un assistant utilisable en industrie

Elle tient en une ligne : **le modèle choisit la question, jamais la réponse.**

Tout chiffre qui atteint un humain doit venir d'un calcul fait par le système,
pas d'une arithmétique faite par le modèle sur du JSON. La raison n'est pas la
méfiance de principe : c'est qu'un système sérieux **refuse de conclure quand il
ne sait pas**. Un calcul d'indicateur qui s'arrête sous un certain taux de
couverture et rend sa raison est utile ; un modèle qui recalcule à côté produit
un chiffre là où le produit disait « on n'en sait rien ».

Deux chiffres, et personne ne sait lequel croire. C'est exactement le scénario
qui détruit la confiance d'un atelier en une seule réunion.

Corollaire pratique : **toute affirmation doit être citée.** Identifiants de
points, fenêtre réellement servie, numéro de révision, identifiant d'alarme. Un
assistant qui cite est un assistant qu'on peut contredire. Un assistant qui
affirme sans citer est invérifiable, donc inutilisable.

## Ce qu'est MCP, en trois paragraphes

Le Model Context Protocol est une convention qui décrit comment un système expose
des **outils** à un assistant : une liste de fonctions nommées, avec leurs
paramètres, leur documentation et la forme de leur réponse.

L'intérêt n'est pas technique, il est économique. Sans convention, brancher un
assistant sur un système demande d'écrire du code de liaison, propre à ce
système et à cet assistant, et de le refaire à chaque changement de l'un ou de
l'autre. Avec une convention, l'assistant découvre lui-même ce qu'il peut
demander, et le même serveur sert Claude, un agent interne ou l'assistant que
votre éditeur de gestion embarquera l'année prochaine.

Ce n'est pas une intelligence, c'est une prise. Ce qui décide de la qualité des
réponses reste ce qu'il y a derrière la prise : les cinq éléments de la section
précédente.

## Les seize outils, et ce qu'ils rendent

Voici ce qu'un assistant peut demander à Meshvise aujourd'hui. La liste vaut
surtout comme grille de comparaison : demandez la même à n'importe quel éditeur.

| Ce que l'assistant veut savoir | L'outil |
|---|---|
| Quelles machines existent, de quel type, dans quelle zone | `list_machines` |
| Ce qu'une machine mesure, avec rôles et unités | `describe_machine` |
| Les points d'une machine ou du parc, filtrés par rôle ou par tag | `list_points` |
| La dernière valeur de points donnés, **avec sa qualité** | `read_live` |
| Une série agrégée sur une fenêtre | `read_history` |
| Min, max, moyenne, écart, disponibilité de la donnée | `point_stats` |
| Les indicateurs dérivés d'une journée d'exploitation | `read_indicators` |
| La consommation agrégée et le talon | `energy_summary` |
| Les alarmes d'une fenêtre, avec état et acquittement | `list_alarms` |
| Les comptes par machine et par sévérité, les récurrences | `alarm_summary` |
| Disponibilité, temps entre défaillances, temps de réparation | `reliability` |
| L'historique des révisions de configuration | `list_revisions` |
| Ce qu'une révision a changé, champ par champ | `diff_revisions` |
| Les pilotes, leur protocole et leur état de connexion | `describe_topology` |
| L'état des composants et l'âge de la configuration | `system_health` |
| Les listes gouvernées : rôles, unités, sévérités, qualités | `describe_vocabulary` |

Le dernier est le moins spectaculaire et le plus important. C'est lui qui permet
au modèle de formuler un filtre valide au lieu d'en inventer un.

Deux outils supplémentaires sont décrits au contrat mais pas encore servis : le
journal des écritures vers le procédé, et le dossier d'incident en un appel.

## Les bornes, et pourquoi elles existent

Un modèle qui explore est un client autrement plus bavard qu'un tableau de bord.
Il peut demander trente jours de série sur cent points en trois appels, sans la
moindre intention de nuire, simplement parce qu'il cherche.

Une intégration sérieuse borne donc ses réponses **dans la définition des
outils**, pas dans un réglage que personne ne relit : une fenêtre par défaut, une
fenêtre maximale, un nombre de points par appel, une pagination obligatoire, un
budget de requêtes par clé.

Le détail qui distingue une bonne implémentation d'une mauvaise : une demande qui
dépasse une borne doit être **rabotée et le dire**. Jamais refusée en silence,
jamais tronquée sans mention. Un assistant qui reçoit quinze jours après en avoir
demandé quatre-vingt-dix, sans le savoir, tirera des conclusions fausses sur une
période qu'il croit complète.

## Ce que l'assistant ne doit pas pouvoir faire

C'est la partie qu'un responsable maintenance veut entendre en premier, et c'est
normal.

**Il ne commande aucun équipement.** Aucun outil d'écriture n'existe, ni vers un
équipement, ni vers la configuration, ni pour acquitter une alarme. Ce n'est pas
un réglage qu'on pourrait ouvrir : c'est une absence, et elle se vérifie.

**Il ne reçoit aucun secret.** Mots de passe d'automates, jetons, chemins de
clés : aucune permission ne les couvre.

**Il n'exécute pas de requête fournie par l'appelant.** Les outils appellent les
services du produit, qui appliquent le périmètre du projet, la qualité des points
et les règles métier. Une requête directe en base contournerait les trois.

Ces trois absences ont un effet secondaire qui mérite d'être compris, parce qu'il
répond à l'objection la plus sérieuse qu'on puisse faire à cette idée.

### L'injection de prompt, et pourquoi elle est inoffensive ici

L'objection est réelle. Les zones de texte libre d'une supervision (les
libellés, la main courante d'une alarme, les commentaires) sont précisément ce
qu'un assistant va lire. Rien n'empêche quelqu'un d'y écrire une instruction
destinée au modèle.

La réponse n'est pas de filtrer ce texte, ce qui ne marche jamais complètement.
La réponse est structurelle : **puisque aucun outil ne peut agir, l'instruction
la mieux formulée du monde ne peut produire qu'une réponse fausse, jamais un
acte.** Une machine ne démarre pas, un seuil ne bouge pas, une alarme ne
s'acquitte pas.

Une réponse fausse se repère et se corrige. Un acte, non.

## Votre modèle, votre clé

Dernier point, et il décide souvent de l'acceptabilité du projet chez une DSI.

Demandez où vont les données. Un système de supervision qui appellerait
lui-même un fournisseur de modèle ferait sortir de l'usine des données de
production, à sa propre initiative, sous sa propre clé. C'est un sujet de
conformité avant d'être un sujet technique.

L'architecture saine est l'inverse : **le client apporte son assistant et sa
clé**, l'éditeur n'héberge aucun modèle, ne détient aucune clé de fournisseur et
ne voit passer aucun jeton. La question à poser se vérifie d'ailleurs facilement
par une seconde question : y a-t-il, dans le produit, du code qui appelle un
fournisseur de modèle ? Si la réponse est non, rien ne peut sortir.

## Les questions à poser à votre éditeur

Sept questions, dans cet ordre. Elles se répondent en un courriel, et les
réponses disent beaucoup.

1. **Vos données portent-elles une identité stable**, distincte du libellé
   affiché ?
2. **Les rôles, unités et sévérités viennent-ils d'une liste gouvernée**, ou
   d'un champ de texte libre ?
3. **Une valeur issue d'une liaison coupée se distingue-t-elle** d'une valeur
   mesurée, dans la réponse elle-même ?
4. **Les indicateurs sont-ils calculés par le système**, avec leur taux de
   couverture, ou faut-il les recalculer à côté ?
5. **L'historique des changements de configuration est-il lisible** par une
   intégration ?
6. **Quels outils sont exposés en écriture ?** La bonne réponse est aucun.
7. **Qui détient la clé du fournisseur de modèle ?** La bonne réponse est vous.

Un éditeur qui répond aux sept par écrit vous dit surtout une chose : il y avait
pensé avant que vous ne le demandiez.

## Ce que ce n'est pas

Pour finir sur une clarification qui évite une déception.

Brancher un assistant sur sa supervision ne donne pas de la maintenance
prédictive, ne détecte pas d'anomalie par apprentissage, et ne remplace personne.
Ce n'est pas un cerveau greffé sur l'atelier : c'est une porte ouverte sur des
données correctement nommées.

L'intelligence reste celle de l'assistant que vous avez choisi. Ce que la
supervision apporte, c'est un parc dont les données sont nommées, qualifiées et
gouvernées, c'est-à-dire exactement ce qui manque à un modèle branché sur une
supervision ordinaire, et ce qui fait la différence entre une réponse vérifiable
et une phrase bien tournée.

Pour les intégrations qui n'ont pas besoin d'un assistant, les voies classiques
restent les bonnes : le guide sur
[l'exposition des données en OPC UA](/fr/guides/exposer-ses-donnees-en-opc-ua/)
compare les trois, et celui sur la
[connexion d'un outil décisionnel](/fr/guides/connecter-power-bi-a-un-historique-industriel/)
détaille la lecture d'un historique.
