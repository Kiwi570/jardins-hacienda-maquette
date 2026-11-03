# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v3 — audit de l'expérience et ajustements

**Parcours**
- Accueil : nouvelle section « En ce moment » sous le premier écran, qui suit la saison (Saint-Sylvestre et commandes à emporter en hiver, journée festive et week-ends en été, carte cadeau toute l'année) ; une tuile disparaît d'elle-même après sa date.
- Menu du haut selon la saison : en hiver Le restaurant, La carte, Agenda, À emporter, Mariages ; en été Terrasse & piscine, La carte, Agenda, Mariages, Infos. Le bouton Menu reste visible sur grand écran.
- Tous les boutons « Réserver » mènent directement au formulaire.
- Barre d'action en bas d'écran sur mobile pour Réserver, Mariages, Fêtes privées, Carte cadeau, À emporter et la fiche Saint-Sylvestre.
- Réserver : sujets réorganisés (table, journée festive, soirée de l'agenda, réception, question) ; pour la Saint-Sylvestre, choix entre le menu (120 €) et l'accord mets et vins (170 €) ; une réception renvoie vers les demandes Mariages ou Fêtes privées.
- Mariages : les cartes Baptême, Anniversaire et Pot de départ ouvrent la demande de Fêtes privées déjà préremplie ; conditions rappelées sous le formulaire.
- Agenda : encart « À emporter » pendant la période des commandes ; bouton « Voir le détail » sur chaque soirée.
- Infos pratiques : bouton Itinéraire, horaires et réservation en tête, puis la saison d'été.
- Terrasse & piscine : texte et boutons adaptés quand on la consulte en hiver.

**Design**
- Titres de page sur deux lignes (accroche puis suite), entêtes plus courts sur les pages pratiques.
- Bouton principal unifié (fond braise, texte crème) partout, y compris sur fond sombre.
- Pied de page sombre avec une invitation finale (Réserver, Appeler) et le logo clair.
- Le restaurant : la section de la cheminée et le portrait du chef réorganisés, galerie resserrée à quatre photos.
- Fêtes privées : trois types en cartes, deux saisons illustrées, galerie.
- Carte : l'ardoise du chef passe après la carte.
- Soirée libanaise : l'affiche en entier, sur un fond flouté de la même affiche.
- Carte cadeau : le mot doux s'affiche sur la carte pendant la saisie, validité « 6 mois » rappelée.
- Alignements, espacements entre sections claires, cases cochées plus visibles, carte d'accès centrée sur la braise.

**Corrections de l'audit complet**
- Galeries photo : tenues à l'écran par le navigateur (position sticky) au lieu d'être épinglées en JavaScript ; plus de saut quand elles s'arrêtent ni quand elles repartent. Sur un téléphone tenu à l'horizontale, elles défilent au doigt.
- En-tête : sur téléphone, le logo et le bouton Menu seulement ; sans JavaScript, le bouton Menu mène au plan du site en pied de page.
- Accueil : le liseré doré suit exactement la coupe entre les deux saisons, à toutes les tailles d'écran.
- Contraste : heures de la frise du Grand Buffet sur la carte sombre, entêtes courts sur téléphone (voile plus dense).
- Carte cadeau : les champs ne débordent plus de la colonne sur tablette.
- Agenda : plus de bouton Réserver sur une soirée passée.
- Mariages et Fêtes privées : la photo du récapitulatif reste visible sur téléphone (en bandeau).
- Au clavier, une photo de galerie qui reçoit le focus arrive à l'écran sans attendre.

**Retours après envoi (simulés)**
- Réservation, demande de réception, commande à emporter et carte cadeau : un message récapitule ce qui a été demandé (date, formule, produits, total, retrait).
- Demande en quatre étapes : sur mobile, le récapitulatif peut être copié.

**Accessibilité et confort**
- Liens qui ouvrent un nouvel onglet annoncés aux lecteurs d'écran.
- Intro plus fluide : la surface animée attend la fin de l'intro.
- Typographie : apostrophes typographiques automatiques, dates écrites en toutes lettres (« du 5 au 31 décembre »).

**Technique**
- Numéro de version des fichiers : ?v=3.
- Fichiers retirés (images plus utilisées) : `assets/images/site/brasero-640.webp`, `brasero-1080.webp`, `fetes-ete-640.webp`, `libanaise-ouverture-640.webp`, `libanaise-ouverture-mobile-640.webp`, `libanaise-ouverture-mobile-1280.webp`, `piscine-nuit-640.webp`, `piscine-nuit-960.webp`, `restaurant-g5-640.webp`, `restaurant-g5-1280.webp`, `restaurant-g6-640.webp`, `restaurant-g6-1280.webp`.

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
