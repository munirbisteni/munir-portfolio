import React from 'react'
import {useLanguage} from "../i18n/LanguageContext.jsx";

const Experience = () => {
    const {t} = useLanguage();
    const w = t.work;

    return (
        <section className="c-space my-20" id="work">
            <div className="w-full text-white-600">
                <h2 className="head-text">{w.title}</h2>

                <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 mt-12">
                    {/* Senhor Contábil */}
                    <article className="lg:col-span-2 rounded-lg bg-black-200 border border-black-300 sm:p-7 p-5 flex flex-col gap-6">
                        <header>
                            <p className="text-xl font-bold text-white-800">{w.company}</p>
                            <p className="text-white-700">{w.role}</p>
                            <p className="text-sm text-white-500 mt-1">{w.place} · {w.period}</p>
                        </header>
                        <ul className="grid sm:grid-cols-2 gap-4">
                            {w.highlights.map(({title, text}) => (
                                <li key={title} className="rounded-lg bg-black-300/50 border border-black-300 p-4">
                                    <p className="font-semibold text-white-800">{title}</p>
                                    <p className="text-sm mt-2">{text}</p>
                                </li>
                            ))}
                        </ul>
                        <a href="/curriculo-munir-bisteni.pdf" target="_blank" rel="noreferrer"
                           className="w-fit flex items-center gap-2 rounded-md bg-black-300 px-4 py-2 text-white hover:bg-black-500 transition-colors">
                            {w.resume}
                            <img src="/assets/arrow-up.png" alt="" className="w-3 h-3"/>
                        </a>
                    </article>

                    {/* Formação e idiomas */}
                    <aside className="rounded-lg bg-black-200 border border-black-300 sm:p-7 p-5 flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <p className="text-xl font-bold text-white-800">{w.educationTitle}</p>
                            {w.education.map(({name, school, period, note}) => (
                                <div key={name}>
                                    <p className="font-semibold text-white-800">{name}</p>
                                    <p className="text-sm">{school}</p>
                                    <p className="text-sm text-white-500">{period}</p>
                                    {note && <p className="text-sm text-white-700 mt-1">{note}</p>}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-bold text-white-800">{w.languagesTitle}</p>
                            <p className="text-sm">{w.languages}</p>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}
export default Experience
