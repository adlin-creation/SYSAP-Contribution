# RXAPA Mobile Server

## Description
Ce projet est un serveur backend pour l'application mobile RXAPA. Il gère les sessions de suivi des utilisateurs et fournit des statistiques hebdomadaires pour les patients.

## Prérequis
- Node.js
- PostgreSQL
- npm ou yarn

## Installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/abdelnassergit/rxapa-mobile-server.git
   cd rxapa-mobile-server
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configurez les variables d'environnement en créant un fichier `.env` à la racine du projet :
   ```
   DB_USER=
   DB_PASSWORD=
   DB_HOST=
   DB_PORT=
   DB_NAME=rxapa
   ```

## Configuration de la Base de Données

Le fichier `src/database.ts` doit être configuré selon votre environnement :

```typescript
{
  user: 'postgres',        // Votre nom d'utilisateur PostgreSQL
  password: '',           // Votre mot de passe PostgreSQL
  host: 'localhost',      // L'adresse de votre serveur PostgreSQL
  database: 'rxapa',      // Le nom de la base de données
  ssl: false             // Activez SSL si nécessaire
}
```

⚠️ Adaptez ces paramètres selon votre configuration PostgreSQL locale ou serveur.

## Démarrage
Pour démarrer le serveur, exécutez :
```bash
npm start
# ou
yarn start
```

## Endpoints
### Session Records
- **POST /session-record** : Créer une nouvelle session de suivi.
- **GET /session-records** : Récupérer toutes les sessions de suivi pour un utilisateur.

### Patient Statistics
- **GET /patient-statistics/weekly** : Récupérer les statistiques hebdomadaires pour un utilisateur.

## Tester avec Postman
Pour tester les endpoints avec Postman, utilisez les exemples suivants :

### Créer une session de suivi
- **URL** : `http://localhost:3000/session-record`
- **Méthode** : `POST`
- **Body** :
  ```json
  {
      "ProgramEnrollementId": 1,
      "difficultyLevel": 3,
      "painLevel": 2,
      "satisfactionLevel": "Satisfied",
      "walkingTime": 30,
      "accomplishedExercice": 3,
      "SessionId": 101
  }
  ```

### Récupérer les statistiques hebdomadaires
- **URL** : `http://localhost:3000/patient-statistics/weekly?ProgramEnrollementId=1&weekNumber=2`
- **Méthode** : `GET`

## Contribution
Les contributions sont les bienvenues ! Veuillez soumettre une pull request pour toute amélioration ou correction de bug.