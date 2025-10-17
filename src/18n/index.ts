import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    supportedLngs: [
      "id",
      "en",
      "es",
      "pt",
      "hi",
      "ja",
      "de",
      "ru",
      "tr",
      "fr",
      "ko",
      "zh",
      "ar",
      "ms",
      "th",
      "vi",
      "km",
    ],
  });

export default i18n;
