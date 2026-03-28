# Share & Translate

![Share & Translate](https://img.shields.io/badge/Version-v3.0-25D366?style=flat-square)
![Chrome](https://img.shields.io/badge/Chrome-88+-blue?style=flat-square)
![Manifest](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> Extension Chrome pour partager n'importe quelle page web vers WhatsApp, LinkedIn ou X, avec traduction automatique.

## Fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| **3 plateformes** | Partagez vers WhatsApp, LinkedIn ou X en un clic depuis le popup ou le menu clic droit. |
| **Traduction automatique** | Détecte la langue et traduit vers le français ou 8 autres langues via Google Translate, sans clé API. |
| **URLs préservées** | Les liens dans le texte ne sont pas traduits — ils restent sous leur forme originale. |
| **Support X.com** | Détecte automatiquement le texte des tweets pour une traduction précise sans sélection manuelle. |
| **Support LinkedIn** | Extrait automatiquement le texte d'un post LinkedIn affiché. |
| **Partage de sélection** | Sélectionnez un extrait, clic droit — seul ce passage est traduit et partagé. |
| **Aperçu avant envoi** | Le popup affiche le texte traduit avant de l'envoyer, avec possibilité de changer la langue. |
| **App ou Web** | Ouvre WhatsApp Desktop ou WhatsApp Web selon votre préférence mémorisée. |

## Plateformes supportées

| Plateforme | Méthode |
|-----------|---------|
| **WhatsApp** | App Desktop (`whatsapp://`) ou WhatsApp Web |
| **LinkedIn** | Boîte de partage LinkedIn avec texte pré-rempli |
| **X (Twitter)** | Intent tweet avec contenu traduit pré-rempli |

## 9 langues supportées

- Français (par défaut)
- Anglais
- Espagnol
- Allemand
- Italien
- Portugais
- Arabe
- Chinois
- Japonais

La détection de la langue source est automatique.

## Installation

1. **Télécharger et décompresser**
   
   Téléchargez `share-translate-v3.zip` et décompressez-le dans un dossier permanent (ex: `Documents/extensions/share-translate`). Ne supprimez pas ce dossier.

2. **Ouvrir la page des extensions Chrome**
   
   ```
   chrome://extensions
   ```

3. **Activer le mode développeur**
   
   En haut à droite de la page des extensions, activez le toggle **"Mode développeur"**.

4. **Charger l'extension**
   
   Cliquez sur **"Charger l'extension non empaquetée"**, naviguez jusqu'au dossier `share-translate-v3` (celui qui contient `manifest.json`) et cliquez sur **Sélectionner**.

5. **Épingler à la barre Chrome**
   
   Cliquez sur l'icône puzzle en haut à droite de Chrome, trouvez **"Share & Translate"** et épinglez-le.

## Utilisation

### A. Via le popup

Cliquez sur l'icône dans la barre Chrome. Le popup affiche un aperçu du contenu traduit. Choisissez la langue, vérifiez, puis cliquez sur le bouton de la plateforme souhaitée : **WhatsApp**, **LinkedIn** ou **X**.

### B. Via le clic droit sur une sélection

Sélectionnez un passage de texte, faites un **clic droit**, puis choisissez **"Share & Translate"** et la plateforme cible dans le sous-menu.

### C. Choisir la langue cible

Dans le popup, utilisez le menu déroulant **"Traduire en"** pour sélectionner parmi les 9 langues disponibles.

### D. App Desktop ou WhatsApp Web (WhatsApp uniquement)

Le toggle **"WhatsApp"** dans le popup permet de choisir entre **App** (ouvre WhatsApp Desktop) et **Web** (ouvre WhatsApp Web). Ce réglage est mémorisé.

## Astuces

- Sur **X.com**, l'extension détecte automatiquement le texte du tweet. Ouvrez un tweet et cliquez sur l'icône.
- Sur **LinkedIn**, l'extension extrait le texte du post affiché automatiquement.
- Les liens présents dans le texte ne sont pas traduits. Ils conservent leur URL d'origine.

## Mettre à jour l'extension

1. Téléchargez la nouvelle version, décompressez et remplacez les fichiers dans le dossier existant.
2. Allez sur `chrome://extensions`, trouvez l'extension et cliquez sur l'icône de rechargement.

## Historique des versions

### v3.0
- **Multi-plateformes** : ajout du partage vers LinkedIn et X (Twitter) via 3 boutons dans le popup.
- **Menu clic droit amélioré** : sous-menus par plateforme (WhatsApp, LinkedIn, X).
- **Support LinkedIn** : extraction automatique du texte des posts.
- **Nouveau nom** : "Share & Translate" (anciennement "WhatsApp Share + Translate").
- **Prêt pour le Chrome Web Store** : Manifest V3 complet, `_locales` FR + EN, icônes 4 tailles.

### v2.1
- **URLs préservées** : les liens présents dans le texte ne sont plus traduits.

### v2.0
- **Lien supprimé** : le lien de la page n'est plus ajouté automatiquement.
- **App Desktop** : choix entre WhatsApp Desktop ou WhatsApp Web.

### v1.0
- Version initiale : popup, traduction automatique, support X.com, menu clic droit, 9 langues.

## Structure du projet

```
share-translate-v3/
├── manifest.json        # Configuration de l'extension (Manifest V3)
├── background.js        # Service worker (traduction, partage, menu contextuel)
├── content.js           # Extraction du contenu des pages
├── popup.html           # Interface du popup
├── popup.js             # Logique du popup
├── _locales/
│   ├── fr/messages.json # Textes en français
│   └── en/messages.json # Textes en anglais
└── icons/               # Icônes (16, 32, 48, 128 px)
```

## Contribution

Les contributions sont les bienvenues ! Suivez ces étapes :

1. **Fork** le projet
2. Créez une branche feature (`git checkout -b feature/ma-fonctionnalite`)
3. Commit vos changements (`git commit -m 'feat: ma fonctionnalité'`)
4. Push sur la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une **Pull Request**

### Ajouter une nouvelle langue

Pour ajouter une langue, modifiez `popup.html` et ajoutez une option dans le select :

```html
<select id="langSelect">
  <!-- langues existantes -->
  <option value="code_langue">Nom de la langue</option>
</select>
```

Ajoutez aussi le code dans `LANG_LABELS` dans `popup.js` :

```js
const LANG_LABELS = {
  // ...
  xx: "XX" // code et label affiché
};
```

### Ajouter une nouvelle plateforme

1. Ajouter un bouton dans `popup.html`
2. Gérer l'événement dans `popup.js` via `doShare("nom_plateforme")`
3. Ajouter la logique d'URL dans `openPlatform()` dans `background.js`
4. Ajouter un sous-menu dans `chrome.contextMenus.create()` dans `background.js`

## Licence

MIT