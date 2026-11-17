import React from 'react'
import {useLanguage} from "../i18n/LanguageContext.jsx";
import {contactInfo} from "../constants/index.js";

const Footer = () => {
    const {t} = useLanguage();
    return (
        <footer className="c-space pt-7 pb-3 border-t border-black-300 flex justify-between items-center flex-wrap gap-5">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-white-500">
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">{contactInfo.email}</a>
                <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{contactInfo.phone}</a>
            </div>

            <div className="flex gap-3">
                <a className="social-icon" href="https://github.com/munirbisteni" target="_blank" rel="noreferrer" aria-label="GitHub">
                    <img src="/assets/github.svg" alt="" className="w-1/2 h-1/2"/>
                </a>
                <a className="social-icon" href="https://www.linkedin.com/in/munir-lucio-bisteni/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <img src="/assets/linkedin.svg" alt="" className="w-1/2 h-1/2 invert"/>
                </a>
            </div>
            <p className="text-white-500">© {new Date().getFullYear()} Munir Bisteni. {t.footer.rights}</p>
        </footer>
    )
}
export default Footer
