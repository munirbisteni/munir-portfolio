import React from 'react'
import {useThree} from "@react-three/fiber";
import ReactLogo from "./ReactLogo.jsx";
import Target from "./Target.jsx";
import Cube from "./Cube.jsx";
import Rings from "./Rings.jsx";
import SceneErrorBoundary from "./SceneErrorBoundary.jsx";

// Objetos decorativos da tela inicial (alvo, cubo, anéis e logo do React).
// As posições são calculadas a partir da área visível da cena (em z = 0), e não fixas:
// assim eles ficam nas laterais, fora da mesa, em qualquer proporção de tela.
const HeroObjects = () => {
    const {viewport, size} = useThree();
    const vw = viewport.width / 2;   // meia largura visível
    const vh = viewport.height / 2;  // meia altura visível
    const px = viewport.height / size.height; // 1 pixel em unidades da cena

    const wide = size.width / size.height > 1.15;

    if (wide) {
        // Telas largas: objetos nas laterais da mesa.
        return (
            <group>
                <SceneErrorBoundary><Rings position={[-vw * 0.78 * 2, vh * 0.62 * 2, 0]}/></SceneErrorBoundary>
                <SceneErrorBoundary><ReactLogo position={[vw * 0.8, vh * 0.45, 0]}/></SceneErrorBoundary>
                <SceneErrorBoundary><Target position={[-vw * 0.8, -vh * 0.75, 0]} scale={1.1}/></SceneErrorBoundary>
                <SceneErrorBoundary><Cube position={[vw * 0.8, -vh * 0.35, 0]} scale={0.6}/></SceneErrorBoundary>
            </group>
        );
    }

    // Telas em pé (celular, tablet): alvo e cubo no espaço entre a mesa e o botão,
    // que ocupa ~90px no rodapé da tela.
    const aboveButton = -vh + 100 * px;
    return (
        <group>
            <SceneErrorBoundary><Rings position={[-vw * 0.55 * 2, vh * 0.42 * 2, 0]}/></SceneErrorBoundary>
            <SceneErrorBoundary><ReactLogo position={[vw * 0.65, vh * 0.42, 0]}/></SceneErrorBoundary>
            <SceneErrorBoundary><Target position={[-vw * 0.62, aboveButton, 0]} scale={0.55}/></SceneErrorBoundary>
            <SceneErrorBoundary><Cube position={[vw * 0.62, aboveButton + 1, 0]} scale={0.38}/></SceneErrorBoundary>
        </group>
    );
}
export default HeroObjects
