import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Page d'accueil
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
      //  Dashbord

      // Composant exercises
      exercice_loading: "Exercise Loading",
      create_exercise: "Create Exercise",
      all: "ALL",
      aerobic: "AEROBIC",
      strength: "STRENGTH",
      endurance: "ENDURANCE",
      flexibility: "FLEXIBILITY",
      low: "LOW",
      below_average: "BELOW_AVERAGE",
      average: "AVERAGE",
      above_average: "ABOVE_AVERAGE",
      high: "HIGH",
      fifty_to_fifty_nine: "FIFTY_TO_FIFTY_NINE",
      sixty_to_sixty_nine: "SIXTY_TO_SIXTY_NINE",
      seventy_to_seventy_nine: "SEVENTY_TO_SEVENTY_NINE",
      eighty_to_eighty_nine: "EIGHTY_TO_EIGHTY_NINE",
      desired_age_group: "Please select the desired age group :",
      select_expected_fitness_level:
        "Please select the expected fitness level : ",
      select_fitness_level: "select fitness level",
      select_target_age_range: "Select target age range",
      exercise_category: "Select Exercise Category",
      enter_exercise_name: "Please enter the name of the exercise :",
      exercise_name: "Exercise Name",
      enter_exercise_description:
        "Please enter the description of the exercise :",
      exercise_description: "Exercise Description",
      enter_exercise_video:
        "Please enter the instructional video of the exercise :",
      exercise_video: "Exercise Instructional Video",
      exercise_image: "Exercise Image :",
      seating_exercise: "Seating Exercise",
      submit: "SUBMIT",
      // Blocs
      create_bloc: "Create bloc",
      enter_bloc_name: "Please enter the name of the bloc : ",
      enter_bloc_description: "Please enter the description of the bloc : ",
      // Session
      create_session: "Create session",
      session_details_title:
        "Enter the following details and then submit to create a new session",
      enter_day_session: "Please enter the name of the day session",
      day_session_name: "Day Session Name",
      enter_day_session_description:
        "Please enter the description of the day session",
      day_session_description: "Day Session Description",
      enter_constraints_day_session:
        "Please enter the constraints of the day session",
      day_session_constraints: "Day Session Constraints",
    },
  },
  fr: {
    translation: {
      // Page d'accueil
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
      //Dashboard

      // Composant exercises
      exercice_loading: "Chargement de l'exercice...",
      create_exercise: "Créer un exercice",
      all: "Tous",
      aerobic: "Aérobie",
      strength: "Force",
      endurance: "Endurance",
      flexibility: "Flexibilité",
      low: "Faible",
      below_average: "Inférieur à la moyenne",
      average: "Moyen",
      above_average: "Supérieur à la moyenne",
      high: "Élevé",
      fifty_to_fifty_nine: "Cinquante à cinquante-neuf",
      sixty_to_sixty_nine: "Soixante à soixante-neuf",
      seventy_to_seventy_nine: "Soixante-dix à soixante-dix-neuf",
      eighty_to_eighty_nine: "Quatre-vingts à quatre-vingt-neuf",
      exercise_category: "Sélectionnez la catégorie de l'exercice",
      desired_age_group: "Veuillez sélectionner le groupe d'âge souhaité :",
      select_expected_fitness_level:
        "Veuillez sélectionner le niveau de forme physique attendu :",
      select_fitness_level: "selectionnez le niveau de forme physique",
      select_target_age_range: "Sélectionnez la tranche d'âge cible",
      enter_exercise_name: "Veuillez entrer le nom de l'exercice :",
      exercise_name: "Nom de l'exercice",
      enter_exercise_description:
        "Veuillez entrer la description de l'exercice :",
      exercise_description: "Description de l'exercice",
      enter_exercise_video:
        "Veuillez entrer la vidéo d'instruction de l'exercice :",
      exercise_video: "Vidéo d'instruction de l'exercice",
      exercise_image: "Image de l'exercice :",
      seating_exercise: "Exercice assis",
      submit: "Soumettre",
      // bloc
      create_bloc: "Créer un bloc",
      enter_bloc_name: "Veuillez entrer le nom du bloc :",
      enter_bloc_description: "Veuillez entrer la description du bloc :",
      create_session: "Créer une session",
      session_details_title:
        "Entrez les détails suivants puis soumettez pour créer une nouvelle session",
      enter_day_session: "Veuillez entrer le nom de la session de jour",
      day_session_name: "Nom de la session de jour",
      enter_day_session_description:
        "Veuillez entrer la description de la session de jour",
      day_session_description: "Description de la session de jour",
      enter_constraints_day_session:
        "Veuillez entrer les contraintes de la session de jour",
      day_session_constraints: "Contraintes de la session de jour",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("i18nextLng") || "fr", //maintenir la langue après refresh, si getItem retourne null alors "fr"
  fallbackLng: "fr", //default language (démarrage en fr)
  interpolation: { escapeValue: false }, // Pour échaper les caractères spéciaux (limite XSS attacks) exemple : les balises
}); // sont interprétés pas affichées

export default i18n;
