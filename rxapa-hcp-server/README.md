# rxapa-hcp-server

## Prérequis

1. Installer PostgreSQL:
   - Téléchargez et installez PostgreSQL depuis [le site officiel](https://www.postgresql.org/download/)
   - Notez bien le mot de passe que vous définissez pendant l'installation

2. Installer pgAdmin 4:
   - Téléchargez et installez pgAdmin 4 depuis [le site officiel](https://www.pgadmin.org/download/)
   - Utilisez pgAdmin 4 pour créer une nouvelle base de données nommée `rxapa`

## Configuration

1. Créez un fichier `.env` à la racine de ce répertoire (`rxapa-hcp-server`) avec les informations suivantes:
```properties
DATABASE_NAME=rxapa
DATABASE_USER=postgres
DATABASE_PASSWORD=<votre_mot_de_passe_postgres>
DATABASE_HOST=localhost
```
Note: `DATABASE_HOST` pourrait être `postgres` au lieu de `localhost`.

## Installation et Démarrage

1. Installez les dépendances :
```bash
npm install
```

2. Démarrez le serveur :
```bash
npm start
```

Le serveur devrait maintenant être opérationnel et prêt à recevoir des requêtes.