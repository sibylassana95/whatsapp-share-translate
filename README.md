# WhatsApp Share + Translate

![WhatsApp Share + Translate](https://img.shields.io/badge/Version-v2.1-25D366?style=flat-square)
![Chrome](https://img.shields.io/badge/Chrome-88+-blue?style=flat-square)
![Manifest](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> Extension Chrome pour partager n'importe quelle page web vers WhatsApp, avec traduction automatique.

## Fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| **Traduction automatique** | Détecte la langue et traduit vers le français ou 8 autres langues via Google Translate, sans clé API. |
| **URLs préservées** | Les liens dans le texte ne sont pas traduits — ils restent sous leur forme originale. |
| **Support X.com** | Détecte automatiquement le texte des tweets pour une traduction précise sans sélection manuelle. |
| **Partage de sélection** | Sélectionnez un extrait, clic droit — seul ce passage est traduit et partagé. |
| **Aperçu avant envoi** | Le popup affiche le texte traduit avant de l'envoyer, avec possibilité de changer la langue. |
| **App ou Web** | Ouvre WhatsApp Desktop ou WhatsApp Web selon votre préférence mémorisée. |

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
   
   Téléchargez `whatsapp-share-translate.zip` et décompressez-le dans un dossier permanent (ex: `Documents/extensions/whatsapp-share`). Ne supprimez pas ce dossier.

2. **Ouvrir la page des extensions Chrome**
   
   ```
   chrome://extensions
   ```

3. **Activer le mode développeur**
   
   En haut à droite de la page des extensions, activez le toggle **"Mode développeur"**.

4. **Charger l'extension**
   
   Cliquez sur **"Charger l'extension non empaquetée"**, naviguez jusqu'au dossier `whatsapp-share-translate` (celui qui contient `manifest.json`) et cliquez sur **Sélectionner**.

5. **Épingler à la barre Chrome**
   
   Cliquez sur l'icône puzzle en haut à droite de Chrome, trouvez **"WhatsApp Share + Translate"** et épinglez-le.

## Utilisation

### A. Via le popup

Cliquez sur l'icône WhatsApp dans la barre Chrome. Le popup affiche un aperçu du contenu traduit. Choisissez la langue, vérifiez, puis cliquez sur **"Partager sur WhatsApp"**.

### B. Via le clic droit sur une sélection

Sélectionnez un passage de texte sur la page, faites un **clic droit**, puis choisissez **"Partager sur WhatsApp (traduit en français)"**.

### C. Choisir la langue cible

Dans le popup, utilisez le menu déroulant **"Traduire en"** pour sélectionner parmi les 9 langues disponibles.

### D. App Desktop ou WhatsApp Web

Le toggle **"Ouvrir via"** dans le popup permet de choisir entre **App WhatsApp** et **WhatsApp Web**. Ce réglage est mémorisé.

## Astuces

- Sur **X.com**, l'extension détecte automatiquement le texte du tweet. Ouvrez un tweet et cliquez sur l'icône.
- Les liens présents dans le texte ne sont pas traduits. Ils conservent leur URL d'origine.

## Mettre à jour l'extension

1. Téléchargez la nouvelle version, décompressez et remplacez les fichiers dans le dossier existant.
2. Allez sur `chrome://extensions`, trouvez l'extension et cliquez sur l'icône de rechargement.

## Historique des versions

### v2.1
- **URLs préservées** : les liens présents dans le texte ne sont plus traduits.

### v2.0
- **Lien supprimé** : le lien de la page n'est plus ajouté automatiquement.
- **App Desktop** : choix entre WhatsApp Desktop ou WhatsApp Web.

### v1.0
- Version initiale : popup, traduction automatique, support X.com, menu clic droit, 9 langues.

## Structure du projet

```
whatsapp-share-translate/
├── manifest.json      # Configuration de l'extension
├── background.js      # Script d'arrière-plan
├── popup.html         # Interface du popup
├── popup.js           # Logique du popup
├── index.html         # Guide d'utilisation (ce fichier)
└── icons/             # Icônes de l'extension
```

## Contribution

Les contributions sont les bienvenues ! Suivez ces étapes :

1. **Fork** le projet
2. Créez une branche feature (`git checkout -b feature/ma-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout: ma fonctionnalité'`)
4. Push sur la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une **Pull Request**

### Ajouter une nouvelle langue

Pour ajouter une langue, modifiez `popup.html` et ajoutez une option dans le select :

```html
<select id="targetLang">
  <!-- langues existantes -->
  <option value="code_langue">Nom de la langue</option>
</select>
```

### Structure du code

- `popup.js` : Logique principale (traduction, partage)
- `background.js` : Gestion du clic droit et context menu
- `popup.html` : Interface utilisateur

## Licence

MIT
