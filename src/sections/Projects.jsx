import React, {useEffect, useRef, useState} from 'react'
import {capimScreens, capimTags, otherProjects} from "../constants/index.js";
import {useLanguage} from "../i18n/LanguageContext.jsx";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";
import useInView from "../hooks/useInView.js";

const Tag = ({children}) => (
    <li className="text-xs text-white-700 bg-black-300 rounded-md px-2.5 py-1">{children}</li>
);

// Prévia do Capim: as telas trocam sozinhas dentro de uma moldura de celular.
const CapimPreview = () => {
    const {t} = useLanguage();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const reducedMotion = usePrefersReducedMotion();
    const [previewRef, inView] = useInView();
    const touchStart = useRef(null);
    const total = capimScreens.length;

    useEffect(() => {
        if (paused || reducedMotion || !inView) return;
        const id = setInterval(() => setIndex((i) => (i + 1) % total), 3500);
        return () => clearInterval(id);
    }, [paused, reducedMotion, inView, total]);

    const go = (step) => setIndex((i) => (i + step + total) % total);

    // Deslizar o dedo para os lados troca de tela; tocar pausa a troca automática.
    const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; setPaused(true); };
    const onTouchEnd = (e) => {
        if (touchStart.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchStart.current = null;
    };

    return (
        <div ref={previewRef} className="flex flex-col items-center gap-4"
             onMouseEnter={() => setPaused(true)}
             onMouseLeave={() => setPaused(false)}>
            <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
                 className="touch-pan-y relative w-[250px] sm:w-[280px] aspect-[390/844] rounded-[44px] border-[6px] border-black-500 bg-black overflow-hidden shadow-[0_0_80px_0_rgba(212,242,58,0.18)]">
                {capimScreens.map((src, i) => (
                    <img key={src}
                         src={src}
                         alt={`Capim — ${t.projects.capim.screenNames[i]}`}
                         loading="lazy"
                         className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}/>
                ))}
            </div>
            <div className="flex items-center gap-4">
                <button type="button" onClick={() => go(-1)} className="arrow-btn" aria-label={t.projects.prev}>
                    <img src="/assets/left-arrow.png" alt="" className="w-4 h-4"/>
                </button>
                <p className="text-sm text-white-600 min-w-40 text-center" aria-live="polite">
                    {t.projects.capim.screenNames[index]}
                    <span className="text-white-500"> · {index + 1}/{total}</span>
                </p>
                <button type="button" onClick={() => go(1)} className="arrow-btn" aria-label={t.projects.next}>
                    <img src="/assets/right-arrow.png" alt="" className="w-4 h-4"/>
                </button>
            </div>
        </div>
    );
};

// Ilustração da iniciação científica: pergunta aberta → PLN → cinco grandes fatores.
const FACTOR_COLORS = ['#7dd3fc', '#a7f3d0', '#fde68a', '#f9a8d4', '#c4b5fd'];
const IcVisual = ({text}) => (
    <div className="w-full aspect-[16/10] rounded-md border border-black-300 bg-gradient-to-br from-black-300 to-black-200 flex flex-col justify-center gap-4 sm:p-6 p-4" aria-hidden="true">
        <p className="rounded-lg rounded-bl-none bg-black-500/60 px-4 py-3 text-white-800 sm:text-lg text-sm italic w-fit max-w-[90%]">
            {text.question}
        </p>
        <div className="flex items-center gap-3 text-white-500 text-sm">
            <span className="h-px flex-1 bg-black-500"/>
            <span className="rounded-full border border-black-500 px-3 py-0.5 text-white-700">{text.method}</span>
            <span className="h-px flex-1 bg-black-500"/>
        </div>
        <ul className="flex flex-wrap gap-2 justify-center">
            {text.factors.map((factor, i) => (
                <li key={factor} className="flex items-center gap-1.5 rounded-full bg-black-300 px-3 py-1 sm:text-sm text-xs text-white-700">
                    <span className="h-2 w-2 rounded-full" style={{backgroundColor: FACTOR_COLORS[i]}}/>
                    {factor}
                </li>
            ))}
        </ul>
    </div>
);

const Projects = () => {
    const {t} = useLanguage();

    return (
        <section className="c-space my-20" id="projects">
            <h2 className="head-text">{t.projects.title}</h2>
            <p className="grid-subtext mt-3">{t.projects.subtitle}</p>

            {/* Capim, em destaque */}
            <div className="mt-12 grid lg:grid-cols-[1fr_auto] gap-10 items-center rounded-lg border border-black-300 bg-black-200 sm:p-10 p-5">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <img src="/projects/capim/icon.png" alt="" className="w-14 h-14 rounded-2xl"/>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-[#D4F23A]">{t.projects.featured}</p>
                            <h3 className="text-3xl font-semibold text-white">Capim</h3>
                        </div>
                    </div>
                    <span className="w-fit flex items-center gap-2 text-sm text-white-700 bg-black-300 rounded-full px-3 py-1">
                        <span className="h-2 w-2 rounded-full bg-[#D4F23A]"/>
                        {t.projects.capim.status}
                    </span>
                    <p className="grid-subtext">{t.projects.capim.desc}</p>
                    <p className="grid-subtext">{t.projects.capim.subdesc}</p>
                    <ul className="flex flex-wrap gap-2">
                        {capimTags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                    </ul>
                    <p className="text-sm text-white-500">{t.projects.privateRepo}</p>
                </div>
                <CapimPreview/>
            </div>

            {/* Outros projetos */}
            <div className="mt-5 grid md:grid-cols-2 grid-cols-1 gap-5">
                {otherProjects.map(({key, title, image, visual, href, code, tags}) => {
                    const text = t.projects[key];
                    const tagList = tags ?? text.tags ?? [];
                    return (
                        <article key={key} className="grid-container">
                            {image && (
                                <a href={href} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-md border border-black-300">
                                    <img src={image} alt={title ?? text.title} loading="lazy"
                                         className="w-full aspect-[16/10] object-cover object-top hover:scale-105 transition-transform duration-500"/>
                                </a>
                            )}
                            {visual === 'ic' && <IcVisual text={text}/>}
                            <div className="flex flex-col gap-3 flex-1">
                                <p className="text-xs uppercase tracking-wider text-white-500">{text.tag}</p>
                                <h3 className="grid-headtext !mb-0">{title ?? text.title}</h3>
                                <p className="grid-subtext">{text.desc}</p>
                                <ul className="flex flex-wrap gap-2">
                                    {tagList.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                                </ul>
                                {(href || code) && <div className="flex gap-5 mt-auto pt-2">
                                    {href && (
                                        <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white hover:underline">
                                            {t.projects.viewSite}
                                            <img src="/assets/arrow-up.png" alt="" className="w-3 h-3"/>
                                        </a>
                                    )}
                                    {code && (
                                        <a href={code} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white hover:underline">
                                            {t.projects.viewCode}
                                            <img src="/assets/arrow-up.png" alt="" className="w-3 h-3"/>
                                        </a>
                                    )}
                                </div>}
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    )
}
export default Projects
