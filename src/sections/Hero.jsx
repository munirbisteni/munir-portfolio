import React, {Suspense} from 'react'
import {Canvas} from "@react-three/fiber";
import {PerspectiveCamera} from "@react-three/drei";
import HackerRoom from "../components/HackerRoom.jsx";
import CanvasLoader from "../components/CanvasLoader.jsx";
import {useMediaQuery} from "react-responsive";
import {calculateSizes} from "../constants/index.js";
import Target from "../components/Target.jsx";
import ReactLogo from "../components/ReactLogo.jsx";
import Cube from "../components/Cube.jsx";
import Rings from "../components/Rings.jsx";

const Hero = () => {

    const isSmall = useMediaQuery({maxWidth: 440})
    const isMobile = useMediaQuery({maxWidth: 768});
    const isTables = useMediaQuery({minWidth: 768, maxWidth: 1024});

    const sizes = calculateSizes(isSmall, isMobile, isTables);

    return (
        <section className="min-h-screen w-full flex flex-col relative">
            <div className="w-full mx-auto flex flex-col sm:mt-36 mt-20 c-space gap-3">
                <p className="sm:text-3xl text-xl font-medium text-white text-center font-generalsans">Hi, i am Munir <span className="waving-hand">👋</span></p>
                <p className="hero_tag text-gray_gradient">Developing Brands & Ideas</p>

                <div className="w-full h-full absolute inset-0">
                    <Canvas className="w-full h-full">
                        <Suspense fallback={<CanvasLoader />}>
                            <PerspectiveCamera makeDefault position={[0, 0, 20]}/>
                            <HackerRoom
                            //        scale={0.05}
                            //        position={[0, 0, 0]}
                            //        rotation={[0, -Math.PI/2 ,0]}
                                    position={sizes.deskPosition}
                                    scale={sizes.deskScale}
                                    rotation={[0, -Math.PI, 0]}
                            />
                            <group>
                                <ReactLogo postion= {sizes.reactLogoPosition} />
                                <Target position = {sizes.targetPosition} />
                                <Cube position = {sizes.cubePosition} />
                                <Rings position = {sizes.ringPosition} />
                            </group>
                            <ambientLight intensity= {1}/>
                            <directionalLight position = {[10, 10, 10]} intensity ={0.5}/>
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </section>
    )
}
export default Hero
