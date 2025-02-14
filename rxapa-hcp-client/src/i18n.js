import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
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
    },
  },
  fr: {
    translation: {
      welcome: "Bienvenue",
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
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
