import React from 'react'
import {useLanguage} from "../i18n/LanguageContext.jsx";

const Bullets = ({items}) => (
    <ul className="flex flex-col gap-3 list-disc pl-5 marker:text-white-500">
        {items.map((item) => (
            <li key={item} className="text-white-600 group-hover:text-white-700 transition-colors">{item}</li>
        ))}
    </ul>
);

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
                        <div className="flex flex-col gap-3">
                            <p className="font-semibold text-white-800">{w.devTitle}</p>
                            <Bullets items={w.dev}/>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="font-semibold text-white-800">{w.infraTitle}</p>
                            <Bullets items={w.infra}/>
                        </div>
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
