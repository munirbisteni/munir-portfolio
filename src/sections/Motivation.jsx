import React from 'react'
import {useLanguage} from "../i18n/LanguageContext.jsx";

const ACCENTS = ['#c4b5fd', '#7dd3fc', '#86efac'];

const Motivation = () => {
    const {t} = useLanguage();
    const m = t.motivation;

    return (
        <section className="c-space my-20" id="motivation">
            <div className="grid lg:grid-cols-[2fr_3fr] gap-10 items-start">
                <div className="lg:sticky lg:top-28">
                    <h2 className="head-text">{m.title}</h2>
                    <p className="mt-5 sm:text-2xl text-xl text-white-800 leading-snug">{m.lead}</p>
                </div>

                <ol className="flex flex-col gap-5">
                    {m.pillars.map(({title, text}, i) => (
                        <li key={title} className="grid grid-cols-[auto_1fr] gap-5 rounded-lg border border-black-300 bg-black-200 sm:p-7 p-5">
                            <span className="w-6 text-sm font-semibold tabular-nums mt-1" style={{color: ACCENTS[i]}}>
                                0{i + 1}
                            </span>
                            <div>
                                <p className="grid-headtext">{title}</p>
                                <p className="grid-subtext">{text}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
export default Motivation
