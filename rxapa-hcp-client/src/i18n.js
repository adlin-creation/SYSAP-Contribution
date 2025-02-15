import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      change_language: "Change Language",
      Dashboard: "Dashboard",
      Exercises: "Exercises",
      Blocs: "Blocs",
      Sessions: "Sessions",
      Cycles: "Cycles",
      Programs: "Programs",
      Patients: "Patients",
      Professionals: "Professionals",
      Doctors: "Doctors",
      Kinesiologists: "Kinesiologists",
      Admins: "Admins",
      Profile: "Profile",
      Settings: "Settings",
      Logout: "Logout",
      // Tous les libellés du composant Dashbord ici

      // Tous les libellés du composant ExerciceMenu ici
      "Exercise Loading...": "Exercise Loading",
      "Create Exercise": "Create Exercise",
      ALL: "ALL",
      AEROBIC: "AEROBIC",
      STRENGHT: "STRENGHT",
      ENDURANCE: "ENDURANCE",
      FLEXIBILITY: "FLEXIBILITY",
      LOW: "LOW",
      BELOW_AVERAGE: "BELOW_AVERAGE",
      AVERAGE: "AVERAGE",
      ABOVE_AVERAGE: "ABOVE_AVERAGE",
      HIGH: "HIGH",
      FIFTY_TO_FIFTY_NINE: "FIFTY_TO_FIFTY_NINE",
      SIXTY_TO_SIXTY_NINE: "SIXTY_TO_SIXTY_NINE",
      SEVENTY_TO_SEVENTY_NINE: "SEVENTY_TO_SEVENTY_NINE",
      EIGHTY_TO_EIGHTY_NINE: "EIGHTY_TO_EIGHTY_NINE",
    },
  },
  fr: {
    translation: {
      change_language: "Changer de langue",
      Dashboard: "Tableau de bord",
      Exercises: "Exercices",
      Blocs: "Blocs",
      Sessions: "Sessions",
      Cycles: "Cycles",
      Programs: "Programmes",
      Patients: "Patients",
      Professionals: "Professionnels",
      Doctors: "Médecins",
      Kinesiologists: "Kinesiologues",
      Admins: "Administrateurs",
      Profile: "Profile",
      Settings: "Paramètres",
      Logout: "Déconnexion",
      // Les traductions des libellés du composant exercice ici
      "Exercise Loading...": "Chargement de l'exercice",
      "Create Exercise": "Créer un exercice",
      ALL: "Tous",
      AEROBIC: "AÉROBIE",
      STRENGHT: "FORCE",
      ENDURANCE: "ENDURANCE",
      FLEXIBILITY: "FLEXIBILITÉ",
      LOW: "FAIBLE",
      BELOW_AVERAGE: "INFÉRIEUR À LA MOYENNE",
      AVERAGE: "MOYEN",
      ABOVE_AVERAGE: "SUPÉRIEUR À LA MOYENNE",
      HIGH: "ÉLEVÉ",
      FIFTY_TO_FIFTY_NINE: "CINQUANTE À CINQUANTE-NEUF",
      SIXTY_TO_SIXTY_NINE: "SOIXANTE À SOIXANTE-NEUF",
      SEVENTY_TO_SEVENTY_NINE: "SOIXANTE-DIX À SOIXANTE-DIX-NEUF",
      EIGHTY_TO_EIGHTY_NINE: "QUATRE-VINGTS À QUATRE-VINGT-NEUF",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language         localStorage.getIem("i18nextLng") ? localstorage.getItem("i18nextLng") : "en"
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
