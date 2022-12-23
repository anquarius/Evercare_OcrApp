import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import cantonese from './zh-hk.json';
import english from "./en-gb.json";
import french from "./fr-fr.json";


i18n.use(initReactI18next).init({

    lng: 'EN',
    fallbackLng: 'EN',

    resources: {
        EN: { translation: english },
        HK: { translation: cantonese },
        FR: { translation: french },
    },
});

export default i18n;