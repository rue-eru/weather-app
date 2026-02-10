//setup code
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import en from './en.json';
import ru from './ru.json';
import ja from './ja.json';

i18next
    .use(initReactI18next)
    .use(I18nextBrowserLanguageDetector)
    .init({
        resources: {
            en: { translation: en },
            ru: { translation: ru },
            ja: { translation: ja},
        },
        lng: 'en', //default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    })

export default i18next