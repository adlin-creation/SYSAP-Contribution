//objective: Contains the configuration for the API.
//objective: Contient la configuration pour l'API.
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Update with the correct IP address for the backend.
  ENDPOINTS: {
    AUTH: '/authenticate',
    SESSION_RECORDS: '/session-records',
    SESSION_RECORD: '/session-record',
    PROGRESSION: '/patient-statistics/details', // Progression endpoint.
    STATISTICS: '/patient-statistics/details', // Endpoint pour les statistiques filtrées (par jour, semaine, ou tout).
    SESSION_EXERCISES: '/sessions/:id/exercises', // Remplacer :id par l'ID de la session.
    ACTIVE_SESSION: '/sessions/active-session', // Pour la récupération de la session active.
    SESSIONS: '/sessions', // Endpoint général pour récupérer les sessions.
  },
};
