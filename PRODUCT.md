# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Les visiteurs de ce site sont surtout des **responsables stock et chefs de service de CAARUD** : ils décident d'installer Stockaarud dans leur structure, puis l'installent eux-mêmes avec le guide, sur un ordinateur. Ils lisent le site entre deux tâches, souvent au bureau du CAARUD, et doivent pouvoir juger vite si l'outil est fiable, gratuit et compatible avec leurs obligations (données, rapport d'activité).

Les **équipes** (intervenants qui distribuent le matériel de réduction des risques, en local, en maraude ou en festival) utilisent l'appli au quotidien ; sur le site, elles viennent surtout pour la fiche équipe et le guide de leur partie.

## Product Purpose

Stockaarud est une application de gestion du stock de matériel de réduction des risques (RdR) pour les CAARUD : l'équipe note chaque sortie en trois clics depuis son téléphone, même sans réseau ; le responsable stock suit le stock, reçoit l'alerte avant la rupture, passe les commandes et sort les chiffres de l'année pour le rapport d'activité.

Ce dépôt est le **site de présentation** (stockaarud.github.io) : accueil avec le film, guide d'installation et d'utilisation, questions fréquentes, documents à imprimer, page alertes, démo avec données fictives. L'appli elle-même vit à https://stockaarud.github.io/stockaarud/. Le site réussit quand un responsable stock comprend ce que fait l'outil, l'essaie dans la démo ou sans compte, puis l'installe pour son CAARUD.

## Positioning

Un outil fait sur le terrain, dans un CAARUD marseillais, par un médecin qui y travaille et avec les équipes qui s'en servent : pensé pour le matériel RdR et le fonctionnement d'un CAARUD (activités, maraudes, stocks multiples, rapport d'activité), gratuit, au code public, et où chaque structure garde ses données dans sa propre base.

## Operating Context

- Installation une seule fois, en environ quinze minutes, sur un ordinateur, par le responsable stock : création d'un projet Supabase gratuit (région Europe, Paris), script SQL, connexion anonyme par code, clé `anon public`, puis installation guidée en cinq écrans.
- Essai possible sans compte, sur un seul appareil, avant de passer en ligne.
- L'équipe rejoint par QR code, lien ou affiche dans le local, sans compte ni mot de passe.
- Usage hors ligne en maraude, en festival, au fond d'un local ; les alertes e-mail partent quand un appareil retrouve du réseau.
- Le responsable stock gère aussi depuis l'ordinateur : commandes, statistiques, inventaire, matériel en tableur, exports PDF.
- Documents imprimés : flyer A5 et A4, affiche QR code pour le local, fiche équipe d'une page, guides utilisateur et d'installation en PDF.

## Capabilities and Constraints

- **Aucune donnée sur les personnes accueillies.** L'appli ne compte que du matériel ; les sorties ne portent aucun nom. Le site ne doit jamais suggérer autre chose, ni ajouter de suivi des visiteurs.
- **Une base par CAARUD.** Chaque structure crée son propre projet Supabase ; il n'y a ni base commune ni compte Stockaarud, et l'équipe Stockaarud n'a pas accès aux bases.
- **Formulaire de contact via Formspree**, avec repli par e-mail vers stockaarud@proton.me. À conserver tel quel.
- Site statique hébergé sur GitHub Pages (HTML, CSS, un peu de JavaScript), sans cookie ; il ne reçoit aucune donnée de stock.
- Alertes e-mail facultatives, via un service d'envoi tenu par Stockaarud, avec confirmation d'inscription et désabonnement.
- Supabase gratuit ne garde pas de copie : l'appli propose une sauvegarde complète en un geste.
- Vocabulaire du terrain à garder : CAARUD, RdR, matos, sortie, entrée, rupture, maraude, activité, responsable stock, inventaire, commande, rapport d'activité.

## Brand Commitments

- Nom : Stockaarud. Logo et wordmark dans `docs/` et `img/` (`logo-stockaarud.svg`, `img/wordmark.png`, `img/icon.png`).
- Accroche en place : « Plus jamais en manque… de matos. »
- Indépendant et bénévole : fait par un médecin de CAARUD, sans affiliation à une institution ni promesse de support commercial.
- Ton : direct, concret, entre collègues du secteur, avec une pointe d'humour ; pas de jargon marketing.
- Contact : stockaarud@proton.me. Code public sur GitHub.

## Evidence on Hand

- Captures de la vraie appli avec des données fictives : `img/` et `img/guide/`.
- Film de présentation de 1 min 49 et tutoriels vidéo courts (installation guidée, invitation de l'équipe, sortie, statistiques) : `video/`.
- Démo jouable avec données fictives : `demo/`.
- Documents imprimables : `flyer/`, `docs/` (PDF et logos), `img/docs/` (aperçus).
- Chiffres affichés : 3 clics pour noter une sortie, 15 minutes d'installation, film de 1 min 49.
- Aucun témoignage, logo de partenaire, nombre de CAARUD utilisateurs ni article de presse n'est disponible : n'en inventer aucun.

## Product Principles

1. Le terrain d'abord : chaque écran et chaque phrase partent du quotidien d'un CAARUD, pas d'un logiciel de stock générique.
2. Montrer l'appli réelle : vraies captures, vraie démo, données fictives annoncées comme telles.
3. Les données restent chez la structure : le dire clairement, sans l'enjoliver.
4. Simple pour l'équipe, complet pour le responsable stock : ne pas noyer l'un sous les besoins de l'autre.
5. Gratuit et ouvert, sans rien promettre qu'un projet bénévole ne puisse tenir.

## Accessibility & Inclusion

- Le site utilise Atkinson Hyperlegible pour le texte : la lisibilité est un choix assumé, à préserver.
- Usage fréquent sur téléphone par les équipes, et sur des ordinateurs d'association parfois anciens : pages légères et lisibles à petite largeur.
