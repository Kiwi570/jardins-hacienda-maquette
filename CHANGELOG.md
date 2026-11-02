# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v2 — les pages des modèles

**Pages ajoutées**
- Le restaurant (`/restaurant`) : la salle au coin du feu avec les braises de la cheminée, l'ardoise du chef, la salle en images (galerie et visionneuse), l'essentiel à savoir et la réservation.
- Fêtes privées (`/fetes-privees`) : baptême, anniversaire, pot de départ, deux saisons, buffets en images, demande en quatre étapes avec récapitulatif.
- Fiches des soirées passées : Soirée libanaise (`/agenda/soiree-libanaise`) et Grand Buffet (`/agenda/grand-buffet`), avec programme, tarif et affiche ; pour le Grand Buffet, la journée en frise et les photos.
- Confidentialité (`/confidentialite`) : données recueillies par les formulaires, usages, conservation, destinataires, réglages gardés dans le navigateur, droits.

**Liens**
- Menu et pied de page : Le restaurant, Fêtes privées, Confidentialité.
- Accueil : la carte « Le restaurant » mène à la nouvelle page, les réceptions proposent aussi Fêtes privées, les soirées passées mènent à leur fiche.
- Agenda : les soirées passées ont leur bouton « Voir la soirée ».
- Mentions sous les formulaires et mentions légales : lien vers Confidentialité.

**Contenu**
- Séminaires retirés : ils ne figurent pas sur le site actuel. La page Mariages propose quatre types de réception.

**Technique**
- La demande en quatre étapes devient un composant partagé par Mariages et Fêtes privées.
- Numéro de version des fichiers : ?v=2. Images de partage pour les nouvelles pages ; nouvelles photos converties (salle, plats, buffets, fêtes).
- Fichiers retirés : `assets/images/site/type-seminaire-640.webp` et `type-seminaire-1280.webp`.

## v1 — la base

**Pages** : accueil, la carte, à emporter, terrasse & piscine, mariages & réceptions, agenda, fiche Saint-Sylvestre, infos pratiques, carte cadeau, réserver, mentions légales, page introuvable. En français.

**Direction « Deux saisons »** : l'hiver (braise, cheminée) d'octobre à mai, l'été (piscine, palmes) de juin à septembre, à l'heure de Paris, avec un interrupteur Été / Hiver. Polices Fraunces (titres) et Manrope (textes), Caveat pour l'ardoise. Logo d'origine.

**Animations** : intro avec le H doré qui s'entoure d'un cercle puis s'ouvre sur la page ; surface WebGL d'eau ou de braise sous le premier écran, qui réagit au défilement et au doigt ; scène des deux saisons qui se partage au défilement ; braises du coin du feu ; ardoise écrite à la craie ; volets de la carte ; compte à rebours de la Saint-Sylvestre ; produits qui s'envolent vers le panier ; palmes qui s'écartent ; carte cadeau en relief ; carte d'accès qui se trace ; galeries épinglées avec visionneuse ; mode calme respecté partout.

**Fonctionnalités (simulées dans la maquette)** : panier des fêtes à emporter (total, jour et moment de retrait, synchronisé entre onglets), demande de réception en quatre étapes avec récapitulatif, réservation préremplie depuis chaque page (dont la journée festive, limitée aux mardis, mercredis et jeudis de juin à septembre), carte cadeau composée en direct, agenda trié automatiquement à la date du jour avec compte à rebours.

**Contenu** : carte et prix réels, événements réels (Saint-Sylvestre, Soirée libanaise, Grand Buffet), journée festive, règles de la piscine, questions fréquentes. Informations manquantes marquées « à compléter », informations d'annuaires marquées « à confirmer ».

**Images** : photos de l'établissement, vidéo de la piscine en boucle, images générées (Grok) marquées « Illustration générée ». Images de partage 1200 × 630 pour chaque page.

**Mise en ligne** : site statique pour Vercel, adresses sans « .html », consigne noindex (pages et en-tête), en-têtes de sécurité, données structurées réelles, audit automatique fourni dans `_audit/`.
