import React, {useRef, useState} from 'react'
import emailjs from '@emailjs/browser'
import {useLanguage} from "../i18n/LanguageContext.jsx";
import {contactInfo} from "../constants/index.js";

const Contact = () => {
    const {t} = useLanguage();
    const formRef = useRef();

    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', message: ''});

    const handleChange = ({target: {name, value}}) => {
        setForm({...form, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            await emailjs.send('service_kkhsc3a', 'template_o4od45c',
                {
                    from_name: form.name,
                    to_name: 'Munir Bisteni',
                    from_email: form.email,
                    to_email: 'munir.mlcb@gmail.com',
                    message: form.message
                },
                '-uLs0P8yA9tWSZzhW'
                );

            setLoading(false);
            setForm({name: '', email: '', message: ''});
            alert(t.contact.success);

        } catch(error){
            setLoading(false);
            console.log(error);
            alert(t.contact.error);
        }
    }
    return (
        <section className="c-space my-20" id="contact">
            {/* Janela de terminal feita em CSS: acompanha a altura do conteúdo em qualquer tela */}
            <div className="max-w-3xl mx-auto rounded-2xl border border-black-300 bg-black-200 overflow-hidden shadow-2xl shadow-black">
                <div className="flex items-center gap-2 px-4 h-10 border-b border-black-300 bg-gradient-to-r from-black-300 via-[#2a2a31] to-black-300" aria-hidden="true">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]"/>
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]"/>
                    <span className="h-3 w-3 rounded-full bg-[#28c840]"/>
                </div>
                <div className="max-w-xl mx-auto sm:px-10 px-5 sm:py-14 py-8">
                    <h2 className="head-text">{t.contact.title}</h2>
                    <p className="text-lg text-white-600 mt-3">{t.contact.text}</p>
                    <p className="text-white-600 mt-3">
                        {t.contact.direct}{' '}
                        <a href={`mailto:${contactInfo.email}`} className="text-white hover:underline">{contactInfo.email}</a>
                        {' · '}
                        <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer" className="text-white hover:underline">WhatsApp {contactInfo.phone}</a>
                    </p>
                    <form ref={formRef} onSubmit={handleSubmit} className="sm:mt-12 mt-8 flex flex-col space-y-7">
                        <label className='space-y-3'>
                            <span className="field-label">{t.contact.name}</span>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="field-input"
                                placeholder={t.contact.namePh}
                            />
                        </label>
                        <label className='space-y-3'>
                            <span className="field-label">{t.contact.email}</span>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="field-input"
                                placeholder={t.contact.emailPh}
                            />
                        </label>
                        <label className='space-y-3'>
                            <span className="field-label">{t.contact.message}</span>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="field-input"
                                placeholder={t.contact.messagePh}
                            />
                        </label>
                        <button className="field-btn hover:bg-white-500 transition-colors" type="submit" disabled={loading}>
                            {loading ? t.contact.sending : t.contact.send}
                            <img  src="/assets/arrow-up.png" alt="" className="field-btn_arrow"/>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
export default Contact
