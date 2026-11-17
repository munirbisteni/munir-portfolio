import React, {useEffect, useState} from 'react'
import {navLinks} from "../constants/index.js";
import {useLanguage} from "../i18n/LanguageContext.jsx";

const LanguageToggle = () => {
    const {lang, t, toggleLang} = useLanguage();
    return (
        <button onClick={toggleLang}
                className="flex items-center rounded-full border border-black-300 bg-black-200 p-0.5 text-sm font-medium"
                aria-label={t.nav.switchLanguage}
                title={t.nav.switchLanguage}>
            {['pt', 'en'].map((code) => (
                <span key={code}
                      className={`px-2.5 py-1 rounded-full uppercase transition-colors ${lang === code ? 'bg-white text-black' : 'text-neutral-400'}`}>
                    {code}
                </span>
            ))}
        </button>
    );
};

// Descobre qual seção está no meio da tela para destacar o link correspondente no menu.
const useActiveSection = () => {
    const [active, setActive] = useState('#home');

    useEffect(() => {
        if (!('IntersectionObserver' in window)) return;
        const sections = navLinks.map(({href}) => document.querySelector(href)).filter(Boolean);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActive(`#${entry.target.id}`);
            });
        }, {rootMargin: '-45% 0px -50% 0px'});
        sections.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    return active;
};

const Navbar = () => {
    const {t} = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const active = useActiveSection();

    const toggleMenu = () => setIsOpen((prev) => !prev);

    const NavItems = () => (
        <ul className="nav-ul">
            {navLinks.map(({id, href, key}) => (
                <li key={id} className="nav-li">
                    <a href={href}
                       className={`nav-li_a ${active === href ? 'is-active' : ''}`}
                       aria-current={active === href ? 'location' : undefined}
                       onClick={() => setIsOpen(false)}>
                        {t.nav[key]}
                    </a>
                </li>
            ))}
        </ul>
    );

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center py-5 mx-auto c-space">
                    <a href="#home" className="text-neutral-400 font-bold text-xl hover:text-white transition-colors">
                        Munir Bisteni
                    </a>

                    <div className="flex items-center gap-4">
                        <nav className="lg:flex hidden">
                            <NavItems/>
                        </nav>
                        <LanguageToggle/>
                        <button onClick={toggleMenu}
                                className="text-neutral-400 focus:outline-none hover:text-white transition-colors lg:hidden flex"
                                aria-label={t.nav.toggleMenu}
                                aria-expanded={isOpen}>
                            <img src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"} alt="" className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className={`nav-sidebar ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <nav className="p-5">
                    <NavItems/>
                </nav>
            </div>
        </header>
    )
}
export default Navbar
