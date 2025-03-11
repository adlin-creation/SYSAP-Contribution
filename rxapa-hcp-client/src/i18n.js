import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem("i18nextLng") || "fr", //maintenir la langue après refresh, si getItem retourne null alors "fr"
    fallbackLng: "fr", //default language (démarrage en fr)
    ns: [
      "App",
      "Blocs",
      "Cycles",
      "Exercises",
      "Evaluation",
      "Patients",
      "Phases",
      "Professionals",
      "Programs",
      "Sessions",
      "Authentication",
    ], // un tableau de namespace (ou chercher)
    defaultNS: "App", // Il faut envisager un defaultNS App ne contient que les clé pour le fichier App
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Où chercher les fichiers JSON
    },

    interpolation: { escapeValue: false }, // Pour échaper les caractères spéciaux (limite XSS attacks) exemple : les balises
  }); // sont interprétés pas affichées

export default i18n;
