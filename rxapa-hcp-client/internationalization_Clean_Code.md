# Guide de Clean Code pour la gestion des langues dans le projet

## 1. Structure des clés de traduction

- Les clés de traduction doivent être claires, cohérentes et logiques. La structure adoptée est la suivante :

- Utilisation du snake_case pour nommer les clés.

Exemple :

```json
{
  "label_first_name": "Prénom",
  "placeholder_email": "Entrez l'adresse courriel",
  "title_edit_Admin": "Modifier l'administrateur"
}
```

## 2. Organisation des fichiers de traduction

Les fichiers JSON contenant les traductions sont placés dans :

local/ar/Backend.json # Arabe
local/en/Backend.json # Anglais
local/es/Backend.json # Espagnol
local/fr/Backend.json # Français

Chaque fichier doit uniquement contenir les traductions d'une langue.

## 3. Gestion des langues avec i18n.js

Le fichier i18n.js est le point central de la gestion des langues. Il est important de :

- Importer et charger les fichiers JSON dans i18n.js (le tableau namespace ns)

- Définir une langue par défaut.

- Activer la détection automatique de la langue selon la préférence utilisateur.

- Offrir un fallback en cas de clé manquante.

## 4. Ajout de nouvelles langues

Si une nouvelle langue doit être ajoutée :

- Créer un nouveau dossier dans public/locales/{lang_code}.

- Ajouter les fichiers translation.json avec les mêmes noms de fichiers et les mêmes clés que les autres langues.

- Vérifier que i18n.js charge bien la nouvelle langue.

- Mettre à jour le LanguageSwitcher dans components/LanguageSwitcher.js pour permettre la sélection de la nouvelle langue.

## 5. Bonnes pratiques pour l'utilisation des traductions

- Ne pas coder en dur les textes dans les composants.

❌ Mauvais : <h1>Créer un bloc</h1>

✅ Bon : <h1>{t('title_create_bloc')}</h1>

- Utiliser des clés descriptives et explicites.

❌ Mauvais : "bloc_1": "Créer un bloc"

✅ Bon : "title_create_bloc": "Créer un bloc"

- Toujours tester l'affichage des langues après modification des fichiers JSON.

## 6. Gestion des mises à jour des traductions

- Lors de l'ajout d'une nouvelle clé, l'ajouter dans toutes les langues disponibles.

- Si une clé est obsolète, la supprimer dans tous les fichiers et vérifier son utilisation dans le code.

- Toujours valider les traductions avec un natif ou un traducteur avant mise en production.

## 7. Gestion des traductions dans le backend

#### 7.1 Structure des clés dans le backend

- Les messages du backend sont envoyés sous forme de clés.
  Exemple :

```javascript
res.status(201).json({ message: "bloc_creation_success" });
```

#### 7.2 Organisation des fichiers de traduction

Les fichiers JSON sont stockés dans le client sous local/ et contiennent les traductions pour le backend :

```code
local/ar/Backend.json  # Arabe
local/en/Backend.json  # Anglais
local/es/Backend.json  # Espagnol
local/fr/Backend.json  # Français
```

#### 7.3 Traduction des messages du backend dans le frontend

Dans le frontend, les réponses du backend sont traduites comme suit :

```javascript
.catch((err) => {
  openModal(t(`Backend:${err.response.data.message}`), true);
});
```

## 8. Règles de nomenclature des clés

- Toutes les clés sont classées alphabétiquement dans les fichiers JSON.
- La nomenclature des clés est standardisée en fonction du type de message :
  - title_xxxx : Titres
  - button_xxxx : Boutons
  - label_xxxx : Labels
  - error_xxxx : Messages d'erreur
  - success_xxxx : Messages de succès
  - placeholder_xxxx : Texte de remplissage
  - text_xxxx : Textes généraux

🎯 Ce guide garantit une gestion propre et efficace des traductions dans le projet. Tout nouveau développeur doit respecter ces conventions pour assurer la maintenabilité du code. 🚀
