import React, {useState} from 'react'
import Globe from "react-globe.gl";
import Button from "../components/Button.jsx";
import {contactInfo, techStack} from "../constants/index.js";
import {useLanguage} from "../i18n/LanguageContext.jsx";

const EMAIL = contactInfo.email;

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
            <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">

                <div className="col-span-1 xl:row-span-3">
                    <div className="grid-container">
                        <img src="/assets/grid1.png" alt="" className="w-full sm:h-[276px] h-fit object-contain"/>
                        <div>
                            <p className="grid-headtext">{t.about.introTitle}</p>
                            <p className="grid-subtext">{t.about.introText}</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 xl:row-span-3">
                    <div className="grid-container">
                        <img src="/assets/grid2.png" alt="" className="w-full sm:h-[276px] h-fit object-contain"/>
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
                </div>

                <div className="col-span-1 xl:row-span-4">
                    <div className="grid-container">
                        <div className="rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center">
                            <Globe
                                height={326}
                                width={326}
                                backgroundColor="rgba(0,0,0,0)"
                                backgroundImageOpacity={0.5}
                                showAtmosphere
                                showGraticules
                                globeImageUrl="https://unpkg.com/three-globe@2.41.12/example/img/earth-night.jpg"
                                bumpImageUrl="https://unpkg.com/three-globe@2.41.12/example/img/earth-topology.png"
                                labelsData={[{
                                    lat: -22.971201,
                                    lng: -46.996410,
                                    text: t.about.globeLabel,
                                    color: "white",
                                    size: 20,
                                }]}
                            />
                        </div>
                        <div>
                            <p className="grid-headtext">{t.about.locationTitle}</p>
                            <p className="grid-subtext">{t.about.locationText}</p>
                            <a href="#contact" className="block w-full mt-10">
                                <Button name={t.about.contactBtn} isBeam containerClass="w-full"/>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-2 xl:row-span-3">
                    <div className="grid-container">
                        <img src="/assets/grid3.png" alt="" className="w-full sm:h-[266px] h-fit object-contain"/>
                        <div>
                            <p className="grid-headtext">{t.about.peopleTitle}</p>
                            <p className="grid-subtext">{t.about.peopleText}</p>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-1 xl:row-span-2">
                    <div className="grid-container">
                        <img src="/assets/grid4.png" alt="" className="w-full md:h-[126px] sm:h-[276px] h-fit object-cover sm:object-top"/>
                        <div className="space-y-2">
                            <p className="grid-subtext text-center">{hasCopied ? t.about.copied : t.about.contactLabel}</p>
                            <button type="button" className="copy-container w-full" onClick={handleCopy}>
                                <img src={hasCopied ? '/assets/tick.svg' : '/assets/copy.svg'} alt=""/>
                                <span className="lg:text-2xl md:text-xl font-medium text-gray_gradient text-white break-all">{EMAIL}</span>
                            </button>
                            <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer"
                               className="block text-center text-white-600 hover:text-white transition-colors">
                                {t.about.whatsapp}: {contactInfo.phone}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default About
