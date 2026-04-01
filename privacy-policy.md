# Politique de Confidentialité — Share & Translate

**Dernière mise à jour :** Mars 2026

---

## Overview

Share & Translate est une extension Chrome qui permet de partager et traduire le contenu de pages web vers WhatsApp, LinkedIn et X. Cette politique décrit comment l'extension gère vos données.

---

## Données Collectées

### Aucune donnée personnelle

Cette extension **ne collecte, ne stocke et ne transmet aucune donnée personnelle** vers ses propres serveurs. Vos informations restent sur votre appareil.

### Traduction

Le texte à traduire est envoyé directement à l'API Google Translate (`translate.googleapis.com`) depuis votre navigateur. Cette requête est effectuée côté client — seul le contenu que vous choisissez de traduire est concerné.

- Google traitement ces requêtes selon sa propre politique de confidentialité
- Aucune donnée n'est conservée par l'extension après la traduction

---

## Stockage Local

L'extension enregistre uniquement vos préférences dans le stockage local de Chrome :

| Préférence | Description |
|------------|-------------|
| Langue cible | Votre langue de traduction préférée |
| Mode WhatsApp | Choix entre application Desktop ou WhatsApp Web |

Ces données sont stockées uniquement sur votre appareil et ne sont **jamais transmises** à des serveurs tiers.

---

## Permissions Demandées

L'extension requiert les permissions suivantes pour fonctionner :

| Permission | Raison |
|------------|--------|
| `activeTab` | Accéder à l'URL et au titre de la page actuelle |
| `scripting` | Extraire le contenu de la page (titre, description, texte sélectionné) |
| `contextMenus` | Ajouter l'option de partage dans le menu clic droit |
| `storage` | Sauvegarder vos préférences localement |

---

## Services Tiers

### Google Translate

Le seul service tiers utilisé est **Google Translate**. Les données envoyées sont :

- Le texte que vous souhaitez traduire
- La langue source détectée
- La langue cible choisie

Ces données sont traitées par Google selon : [Politique de confidentialité Google](https://policies.google.com/privacy)

### Plateformes de partage

Lorsque vous partagez du contenu via WhatsApp, LinkedIn ou X, vous utilisez leurs interfaces officielles. L'extension ne transmet **aucune donnée** à ces plateformes — seul le contenu que vous décidez explicitement de partager est envoyé.

---

## Cookies

Cette extension **n'utilise pas de cookies**.

---

## Collecte de données par Google

Cette extension n'utilise pas Google Analytics ni aucun autre service d'analyse.

---

## Modifications de cette Politique

Toute modification majeure de cette politique de confidentialité sera publiée dans cette page et la date de mise à jour sera modifiée en conséquence.

---

## Nous Contacter

Pour toute question concernant cette politique de confidentialité :

- Ouvrez un issue sur le [dépôt GitHub](https://github.com/sibylassana95/share-translate/issues)
- Ou contactez-moi via [LinkedIn](https://www.linkedin.com/in/sibylassana/)

---

*Cette politique a été conçue pour être claire et transparente. Si vous avez des préoccupations, n'hésitez pas à me contacter.*
