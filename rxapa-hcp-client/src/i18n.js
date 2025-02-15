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

      // Tous les libellés du composant ExerciceMenu | Creation d'exercices ...etc ici
      "Exercise Loading...": "Exercise Loading",
      "Create Exercise": "Create Exercise",
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
      "Exercise Loading...": "Chargement de l'exercice...",
      "Create Exercise": "Créer un exercice",
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
