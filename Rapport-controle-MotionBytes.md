# Rapport de réalisation et contrôle Sprint 1- MotionBytes

## Fonctionnalités implémentées en Sprint 1

### 1.Entrer les données d'évaluation
- **Fichier :** `EvaluationPACE.js`
- **Description :**
Ce composant React permet:  au kinésiologue d'entrer les données d'évaluation type PACE pour un patient.
Il inclut des champs pour les tests de cardio-musculaire, d'équilibre, de mobilité, et de vitesse de marche.
Les données sont validées avant soumission, et un score est calculé pour chaque section.
Le score total détermine le niveau et le programme d'exercice recommandé.

- **Fonctionnalités clés :**
  - Validation des champs.
  - Calcul des scores pour chaque section (cardio-musculaire, équilibre, mobilité).
  - Déterminer le programme recommandé (par niveau et couleur).
  - Affichage des résultats.

- **Données requises :**
  - **Entrées :**
    - `chairTestSupport` : Bouléen qui indique si le test de la chaise est fait avec appui ou non.
    - `chairTestCount` : Nombre de levers pendant le test de la chaise.
    - `balanceFeetTogether`, `balanceSemiTandem`, `balanceTandem`, `balanceOneFooted` : Temps en secondes pour chaque test.
    - `frtPosition` : Position du patient pendant le test(assis, debout, ou ne lève pas les bras).
    - `frtDistance` : Distance en cm pour le test de mobilitée
    - `walkingTime` : Temps en secondes pour marcher 4 mètres.
  - **Sorties :**
    - Scores individuels pour chaque section.
    - Score total et niveau recommandé.
    - Programme d'exercice recommandé (couleur et niveau).
    - Vitesse de marche
    - Objectif de marche.

- **Dépendances :**
  - Ce composant dépend de la base de données pour stocker les évaluations et les associer aux patients.

---

### 2. Rechercher un patient
- **Fichier :** `EvaluationSearch.js`
- **Description :**
Ce composant React permet de rechercher un patient par ID, nom ou prénom.
Les résultats de la recherche sont affichés dans un tableau avec des boutons permettant d accéder aux évaluations.

- **Fonctionnalités clés :**
  - Recherche de patient par ID, nom ou prénom.
  - Affichage des résultats dans un tableau.
  - Boutons pour accéder aux évaluations PACE, PATH, et MATCH (seulement PACE est implémenté pour le moment).

- **Données requises :**
  - **Entrées :**
    - `searchTerm` : Terme de recherche (ID, nom ou prénom).
  - **Sorties :**
    - Liste des patients correspondant au terme de recherche.
    - Boutons pour accéder aux évaluations.

- **Dépendances :**
  - Ce composant dépend de l'API pour rechercher les patients dans la base de données.
---

## Documentation des livrables du Sprint 1

### Issue #KN03 - Créer évaluation PACE (terminé)
- **Description :**
  Cette issue concerne la création du formulaire d'évaluation PACE. Le formulaire est fonctionnel, mais des améliorations sont nécessaires pour la validation et l'intégration avec la base de données.

- **Avancement :**
  - Le formulaire est implémenté avec des champs pour les tests de cardio-musculaire, d'équilibre, de mobilité, et de vitesse de marche.
  - La validation des champs est implémenté
  - Les scores sont calculés et affichés dans une modale.
 - **Tests :**
  - Des tests manuels ont été effectués pour vérifier que le formulaire correspond aux attentes.

- **Problèmes rencontrés :**
  - Difficultés rencontrées pour l'ouverture de l'application.
  - L'intégration avec la base de données pour stocker les évaluations n'est pas encore terminée.

- **Solutions proposées :**
  - Ajouter des tests unitaires pour la validation des champs.
  - Implémenter l'appel API pour stocker les évaluations dans la base de données.

---

### Issue #KN03 - Créer le moteur de recherche client (terminé)
- **Description :**
  Cette issue concerne la création du moteur de recherche des patients.
  Le moteur de recherche est fonctionnel, il permet la recherche par ID, nom ou prénom.

- **Avancement :**
  - Le moteur de recherche est implémenté avec un appel API pour récupérer les patients correspondant.
  - Les résultats sont affichés dans un tableau avec des boutons pour accéder aux évaluations.

- **Tests :**
  - Des tests manuels ont été effectués pour vérifier que la recherche fonctionne correctement.
- **Améliorations possibles :**
  - Ajouter des tests unitaires
---

## Documentation technique

### Modèle de classes
- **Patient :**
  - Attributs : `id`, `lastname`, `firstname`, `evaluations` (liste des évaluations).
  - Méthodes : `addEvaluation(evaluation)`.

- **Evaluation :**
  - Attributs : `id`, `patientId`, `date`, `scores` (cardio-musculaire, équilibre, mobilité), `programme` (couleur et niveau).
  - Méthodes : `calculateTotalScore()`, `determineLevel()`, `determineColor()`.

---

### Modèle de données
- **Table `Patients` :**
  - Colonnes : `id`, `lastname`, `firstname`.

- **Table `Evaluations` :**
  - Colonnes : `id`, `patientId`, `date`, `cardioScore`, `balanceScore`, `mobilityScore`, `totalScore`, `programme`.

---

### Architecture
- **Frontend :**
  - React avec Ant Design pour l'interface utilisateur.
  - Composants principaux : `EvaluationPACE`, `EvaluationSearch`.

- **Backend :**
  - Base de données : PostgreSQL.

---

## Gestion de la dette technique
- **Revue de code :**
  - Le code est propre et bien structuré. Des commentaires ont été ajouté pour expliquer les calculs des scores.
- **Tests :**
  - Aucun test unitaire n'a été implémenté pour le moment.

- **Validation des exigences :**
  - Les exigences fonctionnelles sont respectées.

---

## Conclusion
Ce rapport documente les fonctionnalités implémentées, les livrables du Sprint 1, et les aspects techniques du projet. Il identifie les améliorations nécessaires pour réduire la dette technique et assurer une gestion efficace du projet.