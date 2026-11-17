import React, {Suspense, lazy, useEffect, useRef, useState} from 'react'
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";

const SpinningGlobe = lazy(() => import("./SpinningGlobe.jsx"));

// Só baixa o código do globo quando o cartão está perto de aparecer na tela,
// para não pesar no carregamento inicial da página.
const LazyGlobe = ({size = 260, label}) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const reducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        const el = ref.current;
        if (!el || visible) return;
        if (!('IntersectionObserver' in window)) { setVisible(true); return; }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
        }, {rootMargin: '400px'});
        observer.observe(el);
        return () => observer.disconnect();
    }, [visible]);

    const placeholder = <div className="rounded-full bg-black-300/60" style={{width: size * 0.75, height: size * 0.75}}/>;

    return (
        <div ref={ref} className="flex justify-center items-center pointer-events-none select-none"
             style={{width: size, height: size}} aria-hidden="true">
            {visible ? (
                <Suspense fallback={placeholder}>
                    <SpinningGlobe size={size} label={label} rotate={!reducedMotion}/>
                </Suspense>
            ) : placeholder}
        </div>
    );
};

export default LazyGlobe;
