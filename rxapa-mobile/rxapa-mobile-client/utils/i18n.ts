import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en_app from '../locales/en/App.json';
import fr_app from '../locales/fr/App.json';

const locales = RNLocalize.getLocales();
const defaultLang = locales[0]?.languageCode || 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources: {
        en: { 
            App: en_app 
        },

        fr: {
            App: fr_app
        },
    },
    lng: defaultLang,
    fallbackLng: "fr",
    ns: [
        "App"
    ],
    defaultNS: "App",
    interpolation: { escapeValue: false },
  });

export default i18n;
