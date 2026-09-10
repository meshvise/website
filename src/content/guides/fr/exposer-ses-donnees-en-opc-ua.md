---
title: "Exposer ses données industrielles en OPC UA à un autre système"
description: "Serveur montant, espace d'adressage, sécurité : ce que veut dire exposer ses points en OPC UA, et les trois voies possibles pour alimenter un système tiers."
date: 2026-09-05
lang: fr
audience: "Responsable informatique industrielle, intégrateur, chef de projet MES"
minutes: 8
tags: ["OPC UA", "intégration", "MES", "interopérabilité"]
---

Une supervision qui garde ses données pour elle est un cul-de-sac. Tôt ou tard,
un système de gestion de production, un outil décisionnel ou un moteur de calcul
voudra les mêmes points, et la question devient : par où les lui donner.

OPC UA est la réponse la plus attendue dans l'industrie, et ce n'est pas
toujours la meilleure. Ce guide explique ce que fait un serveur OPC UA montant,
et à quel moment deux autres voies servent mieux.

## Descendant et montant

Le vocabulaire prête à confusion parce que le même protocole sert dans les deux
sens.

**Le client descendant** : votre supervision se connecte au serveur OPC UA d'un
automate pour lire ses valeurs. C'est le sens habituel, celui de l'acquisition.

**Le serveur montant** : votre supervision devient elle-même serveur, et un
système tiers s'y connecte pour lire les points qu'elle a rassemblés.

Le second a un intérêt qui n'est pas évident au premier abord. Un système de
gestion de production qui voudrait lire quinze machines devrait sinon ouvrir
quinze connexions, connaître quinze plans d'adressage et gérer quinze
protocoles différents. En passant par le serveur montant de la supervision, il
ouvre **une** connexion vers un espace d'adressage unifié, où une machine
Modbus, une commande numérique en MTConnect et un régulateur BACnet ont
exactement la même tête.

C'est le vrai apport : l'unification, pas le protocole.

## L'espace d'adressage

Un serveur OPC UA expose ses données dans une arborescence de nœuds, chacun
identifié par un `NodeId`.

L'organisation qui fonctionne reprend la hiérarchie métier plutôt que la
structure technique :

```
Objects
└── Bellecombe
    ├── Atelier usinage
    │   ├── Centre d'usinage CU1
    │   │   ├── Broche/Vitesse        (Double, rpm)
    │   │   ├── Broche/Charge         (Double, %)
    │   │   └── Execution             (String)
    │   └── Tour CN TCN1
    │       ├── TempsCycle            (Double, s)
    │       └── PiecesBonnes          (Int32)
    └── Utilités
        └── Centrale air comprimé
            ├── Debit                 (Double, m³/h)
            └── Pression              (Double, bar)
```

Le système tiers navigue cette arborescence, découvre les points disponibles avec
leur type et leur unité, et souscrit à ceux qui l'intéressent. Il n'a pas besoin
de savoir qu'en dessous, l'un vient d'un registre Modbus et l'autre d'un agent
MTConnect.

Deux points de vigilance sur la conception de cet espace :

**Les identifiants doivent être stables.** Un système tiers mémorise les
`NodeId` auxquels il souscrit. Si votre espace d'adressage se reconstruit à
chaque redémarrage avec des identifiants numériques réattribués, toutes les
souscriptions se cassent. Préférez des identifiants textuels dérivés du chemin
du point.

**La hiérarchie doit être décidée, pas subie.** Si elle reflète l'ordre dans
lequel les pilotes ont été créés, elle sera illisible. Elle doit reprendre le
découpage que connaissent les exploitants : site, atelier, ligne, machine.

## La sécurité, et l'état des choses

C'est le sujet où il faut être précis plutôt que rassurant.

OPC UA prévoit trois réglages indépendants :

- **La politique de chiffrement** : `Basic256Sha256` et les politiques Aes plus
  récentes. Les anciennes, `Basic128Rsa15` et `Basic256`, sont dépréciées par la
  fondation OPC et cassées cryptographiquement. Ne les acceptez pas, même si une
  bibliothèque les propose encore.
- **Le mode de message** : aucun, signature seule, ou signature et chiffrement.
  Signer prouve l'origine et l'intégrité ; chiffrer y ajoute la confidentialité.
- **L'authentification** : anonyme, ou nom d'utilisateur et mot de passe, ou
  certificat client.

Ces trois réglages sont séparés dans la norme, et c'est délibéré : un serveur
peut demander un compte sans chiffrer le canal, ou l'inverse.

**Où en est Meshvise.** Son client descendant, celui qui lit les automates, sait
signer et chiffrer, vérifier le certificat du serveur, et refuse une
configuration incomplète plutôt que de retomber silencieusement en clair. C'est
une exigence des automates récents, dont les S7-1500 livrés configurés pour
refuser une session non protégée.

Son serveur montant, lui, est **en lecture seule et sans chiffrement**. Il est
utilisable, il l'est depuis juin 2026, et il n'a pas encore reçu son
durcissement. En clair : réservez-le à un réseau d'atelier maîtrisé, entre deux
machines que vous contrôlez, et ne l'exposez pas au-delà. Le chiffrement et
l'authentification du serveur sont un chantier identifié, pas une case cochée.

Nous préférons l'écrire ici plutôt que de vous le laisser découvrir en audit.

## Les deux autres voies, souvent meilleures

OPC UA n'est pas toujours le bon choix, et l'exiger par principe coûte parfois
plus cher que l'alternative.

### L'interface REST

Une API HTTP qui rend les valeurs courantes et l'historique en JSON, avec une
clé d'accès. C'est la voie la plus simple pour :

- un outil décisionnel qui interroge une fois par heure,
- un automatisme de flux, du type n8n ou Node-RED,
- un tableau de bord web,
- un script.

Elle demande une authentification par clé, elle traverse les pare-feu sans
discussion, et n'importe quel développeur sait s'en servir sans formation OPC UA.

Pour tout ce qui n'a pas besoin de temps réel, c'est la bonne voie.

### La lecture directe de la base

L'historique vit dans une base PostgreSQL au schéma documenté. Un outil
décisionnel peut s'y connecter en lecture seule et interroger directement, sans
connecteur propriétaire ni export intermédiaire.

C'est imbattable pour l'analyse sur de longues périodes : agréger trois ans de
mesures est un travail de base de données, pas de protocole industriel.

Le revers est réel et mérite d'être dit : interroger la base suppose d'en
connaître le modèle, et ce modèle appartient au produit, donc il peut évoluer.
L'interface REST, elle, est un contrat stable. Pour un usage durable, préférez
l'interface ; pour une extraction ponctuelle ou une exploration, la base est plus
directe.

## Comment choisir

| Votre besoin | La voie |
|---|---|
| Un système de gestion de production qui suit quinze machines en continu | Serveur OPC UA montant |
| Un outil décisionnel qui rafraîchit chaque heure | Interface REST |
| Un rapport mensuel sur trois ans d'historique | Lecture directe de la base |
| Un automatisme qui réagit à un événement | Bus de messages ou webhook |
| Un tableau de bord web maison | Interface REST |

La question à poser n'est pas « quel protocole », mais **à quelle fréquence, et
pour combien de points**. Un système qui lit dix mille points à la seconde et un
rapport mensuel n'ont pas les mêmes besoins, et vouloir les servir par le même
canal donne toujours un mauvais compromis.

## Ce qu'il faut vérifier avant de s'engager

Avant de promettre une intégration OPC UA à un fournisseur tiers, vérifiez trois
choses, dans cet ordre :

1. **Le tiers est-il client ou serveur ?** Beaucoup de systèmes de gestion de
   production sont clients et attendent que vous soyez serveur. Certains font
   l'inverse. Ce malentendu coûte des semaines.
2. **Quelle politique de sécurité exige-t-il ?** Un client qui impose
   `Basic256Sha256` avec certificat ne se connectera pas à un serveur en clair.
3. **Combien de points, à quelle cadence ?** Une souscription à dix mille nœuds
   à cent millisecondes n'est pas le même dimensionnement qu'une lecture horaire
   de cinquante valeurs.

Les trois réponses tiennent en un courriel, et elles évitent la mauvaise
surprise du jour de la mise en service.
