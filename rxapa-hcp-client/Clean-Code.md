# Guide de Clean Code pour la gestion des langues dans le projet

## 1. Structure des clés de traduction

- Les clés de traduction doivent être claires, cohérentes et logiques. La structure adoptée est la suivante :

- Utilisation du snake_case pour nommer les clés.

- Préfixer les clés en fonction de leur contexte d'utilisation.

Exemple :

```json
{
  "create_bloc": "Créer un bloc",
  "enter_bloc_name": "Veuillez entrer le nom du bloc :",
  "enter_bloc_description": "Veuillez entrer la description du bloc :"
}
```

## 2. Organisation des fichiers de traduction

Les fichiers JSON contenant les traductions sont placés dans :

public/locales/fr # Français
public/locales/en # Anglais

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

- Ajouter un fichier translation.json avec les mêmes clés que les autres langues.

- Vérifier que i18n.js charge bien la nouvelle langue.

- Mettre à jour le LanguageSwitcher dans components/LanguageSwitcher.js pour permettre la sélection.

## 5. Bonnes pratiques pour l'utilisation des traductions

- Ne pas coder en dur les textes dans les composants.

❌ Mauvais : <p>Créer un bloc</p>

✅ Bon : <p>{t('create_bloc')}</p>

- Utiliser des clés descriptives et explicites.

❌ Mauvais : "bloc_1": "Créer un bloc"

✅ Bon : "create_bloc": "Créer un bloc"

- Toujours tester l'affichage des langues après modification des fichiers JSON.

## 6. Gestion des mises à jour des traductions

- Lors de l'ajout d'une nouvelle clé, l'ajouter dans toutes les langues disponibles.

- Si une clé est obsolète, la supprimer dans tous les fichiers et vérifier son utilisation dans le code.

- Toujours valider les traductions avec un natif ou un traducteur avant mise en production.

Ce guide garantit une gestion propre et efficace des traductions dans le projet. Tout nouveau développeur doit respecter ces conventions pour assurer la maintenabilité du code.
