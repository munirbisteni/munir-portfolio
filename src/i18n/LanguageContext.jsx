import React, {createContext, useContext, useEffect, useState} from 'react'
import {translations} from "./translations.js";

const STORAGE_KEY = 'portfolio-lang';
const LanguageContext = createContext(null);

const detectLanguage = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'pt' || saved === 'en') return saved;
    } catch { /* storage indisponível */ }
    const browser = (navigator.languages?.[0] || navigator.language || 'pt').toLowerCase();
    return browser.startsWith('pt') ? 'pt' : 'en';
};

export const LanguageProvider = ({children}) => {
    const [lang, setLang] = useState(detectLanguage);
    const t = translations[lang];

    useEffect(() => {
        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
        document.title = t.meta.title;
        document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
        try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage indisponível */ }
    }, [lang, t]);

    const toggleLang = () => setLang((l) => (l === 'pt' ? 'en' : 'pt'));

    return (
        <LanguageContext.Provider value={{lang, t, toggleLang}}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
