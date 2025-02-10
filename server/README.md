# Serveur SYSAP

## Requirements

- Nodejs
- Npm
- docker

## Execution en local

### Installer les dépendances

```sh
npm install
```

### Démarrer le serveur (Port 80 par défaut)

```sh
npm start
```

Le serveur devrait maintenant être en marche locallement sur [http://localhost:80](http://localhost:80)

## Execution avec docker

### Construire l'image

```sh
docker build . -t sysap-server
```

### Lancer le serveur (Port 4000 par défaut)

```sh
docker run -d -p 4000:80 sysap-server
```

### Stopper le serveur

Copier le conteneur ID correspondant après l'éxécution de la commande

```sh
docker ps
```

Arrêter le conteneur

```sh
docker stop <container-id>
```

## Routes

Chaque fichier placé sous `./server/routes/` sera une route accessible comme :
`<base-url>/api/<nouvelle-route>`

Par exemple, une fois que le serveur est en marche sur localhost:80 par exemple il peut être tester rapidement comme ceci:

```sh
curl http://localhost:80/api/exercises
```

Le JSON suivant devrait être retourné:

```json
{
  [
    {
      "id":1,
      "name":"Updated Exercise Name",
      "description":"Updated Exercise Description",
      "numberRepetitionsMin":3,
      "numberRepetitionsMax":8,
      "url":"http://example.com/updated-url"
    },
    {
      "id":3,
      "name":"Sleeping",
      "description":"Ne ris pas",
      "numberRepetitionsMin":50,
      "numberRepetitionsMax":60,
      "url":"https://youtu.be/ojByzJhwVFE"
    },
    {
      "id":4,"name":"Exercise Name",
      "description":"Exercise Description",
      "numberRepetitionsMin":5,
      "numberRepetitionsMax":10,
      "url":"http://example.com/exercise-url"
      }
  ]
}    
```

## Les requêtes depuis le frontend

Voici un **exemple** pour comment communiquer avec le serveur pour chercher ou créer des exercices

```js
// ExerciseService.js
import axios from 'axios';
import { SERVER_BASE_URL } from '@env';

const serverURL = SERVER_BASE_URL || "http://localhost:80";

const ExerciseService = {
  fetchExercises: async function () {
    try {
      const response = await axios.get(`${serverURL}/api/exercises`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createExercise: async function (exerciseName) {
    try {
      const newExercise = {
          "name": "Exercise de test",
          "description": "Description de l'exercise de test",
          "numberRepetitionsMin": 5,
          "numberRepetitionsMax": 10,
          "url": "http://example.com/exercise/test"
      }
      const response = await axios.post(`${serverURL}/api/exercises`, newExercise);
      return response.data; 
    } catch (error) {
      throw error;
    }
  }
};

export default ExerciseService;
```

> À noter que le package `axios` est utiliser pour les méthodes GET et POST, mais on peut tout aussi bien utiliser `fetch` qui vient de base avec react-native

Ensuite dans un component pour aller chercher les exercices :

```jsx
const exercices = await ExerciseService.fetchExercises();
```

Sinon pour en créer un :

```jsx
const createdExercise = await ExerciseService.createExercise(exerciseName);
```

## Dépendances

- express : framework qui fournit des fonctionnalités pour gérer les routes, les réponses HTTP, les middlewares, etc.
- cors : Le module cors est utilisé pour gérer la politique de même origine (Same-Origin Policy) dans une application Express.js. Il permet d'autoriser ou de refuser les requêtes HTTP provenant de différents domaines ou origines
- dotenv : Le module dotenv est utilisé pour charger des variables d'environnement à partir d'un fichier `.env`
- express-rate-limit : Met en place des limites sur le nombre de requêtes que les clients peuvent effectuer sur le serveur
- sqlite3 : Pour l'utilisation d'une base de donnée SQLite