> Ces points d'acces servent simplement comme exemple pour l'instant. 

### Points d'accès API pour les `Exercises`
| Point d'accès           | Méthode | Description                                 | Exemple de Requête | Exemple de Réponse |
|--------------------------|--------|---------------------------------------------|-----------------|-------------------|
| `/exercises`            | GET    | Obtenir tous les exercises                 | N/A             | Liste des exercises |
| `/exercises/:id`        | GET    | Obtenir un exercise par ID                 | N/A             | Exercise unique     |
| `/exercises`            | POST   | Créer un nouvel exercise                   | Données du nouvel exercise | Exercise créé     |
| `/exercises/:id`        | PUT    | Mettre à jour un exercise existant par ID | Données mises à jour | Exercise mis à jour |
| `/exercises/:id`        | DELETE | Supprimer un exercise par ID               | N/A             | Exercise supprimé   |

Modèle d'un `Exercise` :
```json
{
    "id": 1,
    "name": "Exercise de test",
    "description": "Description de l'exercise de test",
    "numberRepetitionsMin": 5,
    "numberRepetitionsMax": 10,
    "url": "http://example.com/exercise/test"
}
```

### Points d'accès API pour les `Patient`
| Point d'accès           | Méthode | Description                                 | Exemple de Requête | Exemple de Réponse |
|--------------------------|--------|---------------------------------------------|-----------------|-------------------|
| `/patients`             | GET    | Obtenir tous les patients                  | N/A             | Liste des patients  |
| `/patients/:id`         | GET    | Obtenir un patient par ID                  | N/A             | Patient unique     |
| `/patients`             | POST   | Créer un nouveau patient                   | Données du nouveau patient | Patient créé     |
| `/patients/:id`         | PUT    | Mettre à jour un patient existant par ID  | Données mises à jour | Patient mis à jour |
| `/patients/:id`         | DELETE | Supprimer un patient par ID               | N/A             | Patient supprimé   |

Modèle d'un `Patient` :
```json
{
    "firstName": "Mylène",
    "lastName": "Aubertin",
    "id": 1
}
```

### Points d'accès API pour les `Program`
| Point d'accès           | Méthode | Description                                 | Exemple de Requête | Exemple de Réponse |
|--------------------------|--------|---------------------------------------------|-----------------|-------------------|
| `/programs`           | GET    | Obtenir tous les programs                | N/A             | Liste des programs  |
| `/programs/:id`       | GET    | Obtenir un program par ID                | N/A             | Programme unique     |

Modèle d'un `Program` :
```json
"name": "PACE",
"description": "This is the pace program",
"duration": 60,
```
