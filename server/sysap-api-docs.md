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
| `/api/programs`           | GET    | Obtenir tous les programs                | N/A             | Liste de `program`  |
| `/api/programs/:programName`       | GET    | Obtenir un program par son nom                | N/A             | Programme unique     |

Modèle pour une liste de `Program` :
```json
200:
    [
        {
            "ProgramName": "Bravo",
            "ProgramDescription": "Drainage of Right Wrist Bursa and Ligament, Perc Approach",
            "ProgramDuration": 10
        },
        {
            "ProgramName": "Bravo",
            "ProgramDescription": "Drainage of Right Wrist Bursa and Ligament, Perc Approach",
            "ProgramDuration": 10
        }
    ]

500:
    { "error": "Internal server error" }
```

Modèle d'un `Program` :
```json
200:
    {
        "ProgramName": "Bravo",
        "ProgramDescription": "Drainage of Right Wrist Bursa and Ligament, Perc Approach",
        "ProgramDuration": 10
    }
404:
    { "error": "Program not found" }
500:
    { "error": "Internal server error" }
```

### Points d'accès API pour les `ProgramEnrollment`
| Point d'accès           | Méthode | Description                                 | Exemple de Requête | Exemple de Réponse |
|--------------------------|--------|---------------------------------------------|-----------------|-------------------|
| `/api/ProgramEnrollment/user/:userId`           | GET    | Obtenir les details sur l'enregistrement d'un patient a un programme                | N/A             | `ProgramEnrollmentInfo`  |
| `/api/programs/:programName`       | PUT    |  demarrer le prgramme pour l e patient                | `{userId : 3}`             | message de confirmation    |

Modèle d'un `ProgramEnrollmentInfo` :
```json
200:
    {
        "ProgramName": "Bravo",
        "ProgramDescription": "Drainage of Right Wrist Bursa and Ligament, Perc Approach",
        "ProgramDuration": 10
    }
404:
    { "error": "Program Enrollment not found" }
500:
    { "error": "Internal server error" }
```
Modèle d'un message de confirmation

```json
200:
    { 
        "message": "Program start date updated successfully." 
    }
404:
    { "error": "Program enrollment not found for the given user ID." }
500:
    { "error": "Internal server error" }
```

### Points d'accès API pour les routes `email`
| Point d'accès           | Méthode | Description                                 | Exemple de Requête | Exemple de Réponse |
|--------------------------|--------|---------------------------------------------|-----------------|-------------------|
| `/api/email`           | GET    | envoyer un courriel avec les informations reçues dans le "body" de la requête              | emaiReq            | message de confirmation  |

Modèle pour emailReq :
```json
{
    "subject" : "objet",
    "message" : "ceci est le message",
    "senderId" : "10"
}
```

Modèle d'un message de confirmation :

```json
200 :
    {
        "msg": "votre courriel a été transmis avec succès!"
    }
404 :
    { "error": "Patient not found" }
500 :
    {"error" : "une erreur est survenue lors la transmission du courriel veuillez contacter votre administrateur si le problème persiste"}
```

