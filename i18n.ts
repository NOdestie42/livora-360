import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";

const locales = Localization.getLocales();
const deviceLanguage = locales.length > 0 && locales[0].languageCode
    ? locales[0].languageCode
    : "en";

i18n
    .use(initReactI18next)
    .init({
        lng: deviceLanguage,
        fallbackLng: "en",
        resources: {
            en: { translation: en },
            es: { translation: es },
        },
        interpolation: { escapeValue: false },
    });

export default i18n;
