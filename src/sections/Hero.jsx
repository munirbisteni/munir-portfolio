import React, {Suspense} from 'react'
import {Canvas} from "@react-three/fiber";
import {PerspectiveCamera} from "@react-three/drei";
import HackerRoom from "../components/HackerRoom.jsx";
import CanvasLoader from "../components/CanvasLoader.jsx";
import {useMediaQuery} from "react-responsive";
import {calculateSizes} from "../constants/index.js";
import HeroCamera from "../components/HeroCamera.jsx";
import HeroObjects from "../components/HeroObjects.jsx";
import Button from "../components/Button.jsx";
import SceneErrorBoundary from "../components/SceneErrorBoundary.jsx";
import {useLanguage} from "../i18n/LanguageContext.jsx";

const Hero = () => {
    const {t} = useLanguage();

    const isSmall = useMediaQuery({maxWidth: 440})
    const isMobile = useMediaQuery({maxWidth: 768});
    const isTables = useMediaQuery({minWidth: 768, maxWidth: 1024});
    const isShort = useMediaQuery({maxHeight: 820});

    const sizes = calculateSizes(isSmall, isMobile, isTables, isShort);

    return (
        <section className="min-h-screen w-full flex flex-col relative" id="home">
            <div className="w-full mx-auto flex flex-col sm:mt-36 mt-20 c-space gap-3">
                <div className="relative z-10 pointer-events-none flex flex-col gap-3">
                <p className="sm:text-3xl text-xl font-medium text-white text-center font-generalsans">{t.hero.greeting} <span className="waving-hand">👋</span></p>
                <div className="-mt-1">
                    <h1 className="hero_tag text-gray_gradient">{t.hero.line1}</h1>
                    <p className="hero_tag text-gray_gradient">{t.hero.line2}</p>
                </div>
                </div>


                <div className="w-full h-full absolute inset-0">
                    <SceneErrorBoundary>
                    <Canvas className="w-full h-full">
                        <Suspense fallback={<CanvasLoader />}>
                            <PerspectiveCamera makeDefault position={[0, 0, 20]}/>
                            <HeroCamera isMobile = {isMobile}>
                                <HackerRoom
                                    //        scale={0.05}
                                    //        position={[0, 0, 0]}
                                    //        rotation={[0, -Math.PI/2 ,0]}
                                    position={sizes.deskPosition}
                                    scale={sizes.deskScale}
                                    rotation={[0, -Math.PI, 0]}
                                />
                            </HeroCamera>
                            <HeroObjects/>
                            <ambientLight intensity= {1}/>
                            <directionalLight position = {[10, 10, 10]} intensity ={0.5}/>
                        </Suspense>
                    </Canvas>
                    </SceneErrorBoundary>
                </div>
                <div className="absolute bottom-7 left-0 right-0 w-full z-10 c-space">
                    <a href="#contact" className="w-fit">
                        <Button name={t.hero.cta} isBeam containerClass = "sm:w-fit w-full sm:min-w-96"/>

                    </a>
                </div>
            </div>
        </section>
    )
}
export default Hero
