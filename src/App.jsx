import React from 'react'
import Navbar from "./sections/Navbar.jsx";
import Hero from "./sections/HeroPortrait.jsx"; // PRÉVIA (original: ./sections/Hero.jsx)
import About from "./sections/About.jsx";
import Contact from "./sections/Contact.jsx";
import Footer from "./sections/Footer.jsx";
import Experience from "./sections/Experience.jsx";
import Projects from "./sections/Projects.jsx";
import Motivation from "./sections/Motivation.jsx";

const App = () => {
    return (
        <main className="max-w-7xl mx-auto">
            <Navbar/>
            <Hero/>
            <About/>
            <Motivation/>
            <Projects/>
            <Experience/>
            <Contact/>
            <Footer/>
        </main>
    )
}
export default App
