---
title: "Superviser un bâtiment tertiaire en BACnet"
description: "Instance d'équipement, type d'objet, numéro d'objet : comment adresser un point BACnet, et pourquoi la découverte par diffusion vous trahira le jour de la mise en service."
date: 2026-09-06
lang: fr
audience: "Exploitant de bâtiment, technicien CVC, intégrateur en génie climatique"
minutes: 8
tags: ["BACnet", "CVC", "tertiaire", "protocoles"]
---

BACnet est le protocole du bâtiment, et il a une particularité que les
protocoles industriels n'ont pas : il est **auto-descriptif**. Un équipement
BACnet sait dire ce qu'il expose, avec des noms lisibles et des unités.

C'est une bonne nouvelle pour la mise en service, et un piège pour
l'exploitation, parce que le mécanisme qui permet cette découverte est aussi
celui qui casse le plus souvent en réseau réel.

## Le modèle : trois nombres pour un point

Un point BACnet s'adresse par trois éléments.

**L'instance d'équipement.** Un entier unique sur le réseau, entre 0 et
4 194 302, qui identifie l'automate de traitement d'air ou le régulateur. Il ne
dépend pas de l'adresse IP : c'est l'identité BACnet de l'équipement, et c'est
elle qui compte.

**Le type d'objet.** Ce que la valeur représente :

| Type d'objet | Ce qu'il porte |
|---|---|
| `analogInput` | Une mesure physique, lue par l'équipement |
| `analogValue` | Une valeur interne, souvent une consigne ou un calcul |
| `analogOutput` | Une commande analogique, un pourcentage d'ouverture |
| `binaryInput` | Un état tout ou rien lu |
| `binaryValue` | Un état interne |
| `multiStateValue` | Un mode de fonctionnement, énuméré |

**Le numéro d'objet**, qui distingue le troisième `analogValue` du quatrième.

Un point s'écrit donc : équipement 210, `analogValue`, numéro 1. C'est la
température de reprise de la centrale de traitement d'air.

## Le piège : la découverte par diffusion

BACnet découvre les équipements par diffusion. Un message est envoyé à tout le
réseau, chaque équipement répond, et l'outil dresse la liste.

Cela fonctionne parfaitement sur une maquette et sur un réseau plat. En
exploitation, trois situations le cassent :

**Le réseau segmenté.** Les diffusions ne traversent pas les routeurs. Si votre
supervision est sur le réseau informatique et les équipements sur le réseau
technique, la découverte ne trouve rien, alors que les équipements répondent
parfaitement en adressage direct.

Le protocole prévoit une solution, le relais de diffusion (BBMD), qui demande une
configuration côté réseau et une entrée par sous-réseau. C'est une pièce de plus
à maintenir, et personne ne se souvient de son existence trois ans plus tard.

**La conteneurisation.** Une supervision qui tourne dans un conteneur n'est pas
sur le même plan réseau que l'hôte. Les diffusions partent dans le vide, ou
n'arrivent pas.

**Le trafic.** Sur un parc de plusieurs centaines d'équipements, une découverte
générale produit une tempête de réponses qui peut perturber la régulation
pendant quelques secondes.

**La conclusion pratique** : servez-vous de la découverte pour l'inventaire, une
fois, sur un poste raccordé au bon réseau. Mais déclarez ensuite vos équipements
par adresse et par instance. Une configuration explicite ne dépend d'aucune
diffusion, se relit dans un fichier, et survit à un changement de plan
d'adressage.

C'est le choix que fait Meshvise : les équipements BACnet se déclarent par
adresse, jamais par diffusion, précisément pour éviter les surprises en réseau
segmenté et en conteneur. Le [détail de chaque protocole](/fr/protocoles/) précise
ce que chacun sait faire.

## Ce qu'il faut demander à l'installateur

Une liste de points BACnet fournie par l'intégrateur CVC contient rarement les
trois éléments dont vous avez besoin. Demandez-les explicitement :

1. **La liste des instances d'équipement**, avec le nom et l'emplacement de
   chaque automate.
2. **Le fichier EDE** de chaque équipement s'il existe. C'est un tableur
   normalisé qui liste tous les objets exposés, avec leur type, leur numéro,
   leur nom et leur unité. Un bon intégrateur l'a ; il évite deux jours de
   relevé à la main.
3. **Le plan d'adressage IP** et les segments concernés.

Sans le fichier EDE, la découverte reste le moyen le plus rapide de dresser la
liste, à condition de pouvoir la faire une fois depuis le bon endroit.

## Les points qui valent la peine

Un bâtiment tertiaire expose souvent plusieurs milliers d'objets. Les enregistrer
tous n'apporte rien et coûte du volume. Les familles qui servent vraiment :

**Sur une centrale de traitement d'air** : température de soufflage, de reprise
et de reprise extérieure, position des registres, pourcentage de la batterie
chaude et de la batterie froide, état du ventilateur, pression différentielle du
filtre.

Cette dernière est la plus rentable : elle monte lentement à mesure que le filtre
s'encrasse, et un [seuil bien placé](/fr/guides/alarmes-severites-hysteresis-acquittement/)
remplace un changement calendaire par un changement au bon moment.

**Sur un groupe froid** : température de départ et de retour d'eau glacée, état
des compresseurs, consigne, et si l'équipement l'expose, la puissance absorbée.
L'écart entre départ et retour est l'indicateur qui dit si la boucle circule
correctement.

**Sur une chaudière** : température de fumées, de départ, taux de modulation.
La température de fumées est un excellent indicateur d'entretien : elle dérive
vers le haut à mesure que l'échangeur s'encrasse.

**Sur les comptages** : les index d'énergie, en enregistrement à intervalle fixe
et non sur variation, pour que la courbe reste continue même quand la
consommation ne bouge pas.

## Cadence et volume

BACnet n'aime pas être interrogé trop vite, et rien dans un bâtiment ne bouge
assez vite pour le justifier.

- Températures d'ambiance et de fluide : une lecture toutes les trente secondes
  à une minute.
- États et positions : une lecture toutes les dix à trente secondes.
- Index d'énergie : une lecture par minute, enregistrée à intervalle fixe.

Une cadence d'une à deux secondes sur un parc BACnet ne mesure rien de plus et
charge inutilement des équipements dont le processeur est déjà occupé à réguler.

## L'écriture, et la prudence qu'elle demande

BACnet permet d'écrire : forcer une consigne, ouvrir un registre, changer un
mode. C'est utile, et c'est le point où une supervision peut faire des dégâts.

Deux règles qui n'ont rien de spécifique à un produit :

**Écrivez sur les valeurs prévues pour ça.** Un `analogValue` de consigne est
fait pour recevoir une écriture. Un `analogInput` est une mesure : y écrire n'a
pas de sens, et certains équipements l'acceptent quand même.

**Utilisez la priorité BACnet.** Le protocole prévoit seize niveaux de priorité
pour l'écriture d'une commande, et un mécanisme de relâchement. Une supervision
qui écrit sans priorité, ou qui ne relâche jamais, laisse un équipement bloqué
sur une consigne que plus personne ne comprend six mois plus tard.

Toute écriture doit par ailleurs être tracée : qui a écrit, quelle valeur, quand,
et avec quel résultat. Une consigne changée sans trace est une enquête garantie.

## Le raccordement, en résumé

```
Équipement : instance 210, adresse bacnet-cta1.batiment.lan, port 47808
Point      : analogValue 1   →  température de reprise, en °C
Point      : analogValue 2   →  consigne de soufflage, en °C
Point      : binaryValue 1   →  marche ventilateur
Point      : analogInput 4   →  pression différentielle filtre, en Pa
```

Comptez une demi-journée pour un premier équipement, découverte et vérification
comprises, puis une vingtaine de minutes par équipement suivant si vous avez les
fichiers EDE. La partie longue n'est jamais le protocole : c'est d'obtenir la
liste des instances auprès de celui qui a posé l'installation.
