import React, {useState} from 'react'
import LazyGlobe from "../components/LazyGlobe.jsx";
import Button from "../components/Button.jsx";
import {contactInfo, techStack} from "../constants/index.js";
import {useLanguage} from "../i18n/LanguageContext.jsx";

const EMAIL = contactInfo.email;

// Layout (xl): três colunas: apresentação | tecnologias | localização e contato.
const About = () => {
    const {t} = useLanguage();
    const [hasCopied, setHasCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(EMAIL);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    }

    return (
        <section className="c-space my-20" id="about">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {/* Apresentação */}
                <div className="grid-container">
                    <div className="w-full h-[200px] sm:h-[240px] flex items-center justify-center">
                        <img src="/assets/avatar.webp" alt={t.about.avatarAlt} width="200" height="200"
                             className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-3xl border border-black-300 object-cover shadow-2xl shadow-black"/>
                    </div>
                    <div>
                        <p className="grid-headtext">{t.about.introTitle}</p>
                        <p className="grid-subtext">{t.about.introText}</p>
                    </div>
                    <div className="mt-auto flex gap-3">
                        <a href="https://github.com/munirbisteni" target="_blank" rel="noreferrer"
                           className="flex items-center gap-2 rounded-md bg-black-300 px-3 py-2 text-sm text-white-700 hover:text-white transition-colors">
                            <img src="/assets/github.svg" alt="" className="w-4 h-4"/>GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/munir-lucio-bisteni/" target="_blank" rel="noreferrer"
                           className="flex items-center gap-2 rounded-md bg-black-300 px-3 py-2 text-sm text-white-700 hover:text-white transition-colors">
                            <img src="/assets/linkedin.svg" alt="" className="w-4 h-4 invert"/>LinkedIn
                        </a>
                    </div>
                </div>

                {/* Tecnologias */}
                <div className="grid-container">
                    <img src="/assets/grid2.png" alt="" className="w-full h-[200px] sm:h-[240px] object-contain"/>
                    <div>
                        <p className="grid-headtext">{t.about.stackTitle}</p>
                        <p className="grid-subtext">{t.about.stackText}</p>
                        <ul className="flex flex-wrap gap-2 mt-4">
                            {techStack.map((tech) => (
                                <li key={tech} className="text-sm text-white-700 bg-black-300 rounded-md px-2.5 py-1">{tech}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Localização e contato */}
                <div className="md:col-span-2 xl:col-span-1">
                    <div className="grid-container md:flex-row xl:flex-col md:items-center xl:items-stretch">
                        <div className="flex justify-center shrink-0">
                            <LazyGlobe size={260} label={t.about.globeLabel}/>
                        </div>
                        <div className="flex flex-col gap-6 w-full">
                            <div>
                                <p className="grid-headtext">{t.about.locationTitle}</p>
                                <p className="grid-subtext">{t.about.locationText}</p>
                            </div>
                            <div className="flex flex-col gap-3 border-t border-black-300 pt-6">
                                <p className="text-sm text-white-500">{hasCopied ? t.about.copied : t.about.contactLabel}</p>
                                <button type="button" onClick={handleCopy}
                                        className="flex items-center gap-3 text-left text-white hover:text-white-700 transition-colors">
                                    <img src={hasCopied ? '/assets/tick.svg' : '/assets/copy.svg'} alt="" className="w-5 h-5"/>
                                    <span className="text-lg font-medium break-all">{EMAIL}</span>
                                </button>
                                <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer"
                                   className="text-white-600 hover:text-white transition-colors">
                                    {t.about.whatsapp}: {contactInfo.phone}
                                </a>
                            </div>
                            <a href="#contact" className="block w-full">
                                <Button name={t.about.contactBtn} isBeam containerClass="w-full"/>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
export default About
