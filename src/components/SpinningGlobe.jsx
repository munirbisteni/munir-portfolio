import React, {useCallback, useEffect, useRef} from 'react'
import Globe from "react-globe.gl";

// Globo decorativo: começa sobre Valinhos, gira sozinho e não responde a toque/mouse.
// Fica num arquivo separado para ser baixado só quando aparece na tela (ver LazyGlobe).
// `active` = está visível; fora da tela a animação para, para não pesar na rolagem do celular.
const SpinningGlobe = ({size, label, rotate, active}) => {
    const globeRef = useRef();

    const handleGlobeReady = useCallback(() => {
        const globe = globeRef.current;
        if (!globe) return;
        // Telas de celular têm densidade 3x; desenhar o globo em 1,5x já fica nítido e custa bem menos.
        globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        globe.pointOfView({lat: -22.97, lng: -46.99, altitude: 2.2}, 0);
        const controls = globe.controls();
        controls.autoRotate = rotate;
        controls.autoRotateSpeed = 0.6;
        controls.enableZoom = false;
        controls.enableRotate = false;
        controls.enablePan = false;
    }, [rotate]);

    useEffect(() => {
        const globe = globeRef.current;
        if (!globe) return;
        if (active) globe.resumeAnimation(); else globe.pauseAnimation();
    }, [active]);

    return (
        <Globe
            ref={globeRef}
            onGlobeReady={handleGlobeReady}
            enablePointerInteraction={false}
            rendererConfig={{antialias: false, alpha: true, powerPreference: 'low-power'}}
            height={size}
            width={size}
            backgroundColor="rgba(0,0,0,0)"
            backgroundImageOpacity={0.5}
            showAtmosphere
            showGraticules
            globeImageUrl="https://unpkg.com/three-globe@2.41.12/example/img/earth-night.jpg"
            bumpImageUrl="https://unpkg.com/three-globe@2.41.12/example/img/earth-topology.png"
            labelsData={[{lat: -22.971201, lng: -46.996410, text: label, color: "white", size: 20}]}
        />
    );
};

export default SpinningGlobe;
