import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en_home from '../locales/en/Home.json';
import en_index from '../locales/en/Index.json';
import en_layout from '../locales/en/Layout.json';
import en_cahier from '../locales/en/CahierDeSuivi.json';
import en_config from '../locales/en/Configuration.json';
import en_programme from '../locales/en/Programme.json';
import en_progression from '../locales/en/Progression.json';
import en_seance from '../locales/en/Seance.json';

import fr_home from '../locales/fr/Home.json'
import fr_index from '../locales/fr/Index.json'
import fr_layout from '../locales/fr/Layout.json';
import fr_cahier from '../locales/fr/CahierDeSuivi.json';
import fr_config from '../locales/fr/Configuration.json';
import fr_programme from '../locales/fr/Programme.json';
import fr_progression from '../locales/fr/Progression.json';
import fr_seance from '../locales/fr/Seance.json';

let locales = [];
try {
    locales = RNLocalize.getLocales();
} catch (error) {
    console.error('Error fetching locales:', error);
    locales = [{ languageCode: 'fr' }];
}
const defaultLang = locales[0]?.languageCode || 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources: {
        en: { 
            Home: en_home,
            Index: en_index,
            Layout: en_layout,
            Cahier: en_cahier,
            Config: en_config,
            Programme: en_programme,
            Progression: en_progression,
            Seance: en_seance
        },

        fr: {
            Home: fr_home,
            Index: fr_index,
            Layout: fr_layout,
            Cahier: fr_cahier,
            Config: fr_config,
            Programme: fr_programme,
            Progression: fr_progression,
            Seance: fr_seance
        },
    },
    lng: defaultLang,
    fallbackLng: "fr",
    ns: [
        "Home",
        "Index",
        "Layout",
        "Cahier",
        "Programme",
        "Progression",
        "Seance"
    ],
    defaultNS: "Home",
    interpolation: { escapeValue: false },
  });

export default i18n;
