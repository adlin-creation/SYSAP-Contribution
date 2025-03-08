import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { I18nManager } from 'react-native';

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

import es_home from '../locales/es/Home.json'
import es_index from '../locales/es/Index.json'
import es_layout from '../locales/es/Layout.json';
import es_cahier from '../locales/es/CahierDeSuivi.json';
import es_config from '../locales/es/Configuration.json';
import es_programme from '../locales/es/Programme.json';
import es_progression from '../locales/es/Progression.json';
import es_seance from '../locales/es/Seance.json';

import ar_home from '../locales/ar/Home.json';
import ar_index from '../locales/ar/Index.json';
import ar_layout from '../locales/ar/Layout.json';
import ar_cahier from '../locales/ar/CahierDeSuivi.json';
import ar_config from '../locales/ar/Configuration.json';
import ar_programme from '../locales/ar/Programme.json';
import ar_progression from '../locales/ar/Progression.json';
import ar_seance from '../locales/ar/Seance.json';

let locales = [];
try {
    locales = RNLocalize.getLocales();
} catch (error) {
    console.error('Error fetching locales:', error);
    locales = [{ languageCode: 'fr' }];
}

const defaultLang = locales[0]?.languageCode || 'fr';

//Pour déterminer s'il faut mettre le texte de droite à gauche ou l'inverse
const isRTL = defaultLang === 'ar';
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

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

        es: {
            Home: es_home,
            Index: es_index,
            Layout: es_layout,
            Cahier: es_cahier,
            Config: es_config,
            Programme: es_programme,
            Progression: es_progression,
            Seance: es_seance
        },

        ar: {
            Home: ar_home,
            Index: ar_index,
            Layout: ar_layout,
            Cahier: ar_cahier,
            Config: ar_config,
            Programme: ar_programme,
            Progression: ar_progression,
            Seance: ar_seance
        }
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
