import React, {Suspense, lazy, useEffect, useRef, useState} from 'react'
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";
import useInView from "../hooks/useInView.js";
import CssGlobe from "./CssGlobe.jsx";

const SpinningGlobe = lazy(() => import("./SpinningGlobe.jsx"));

// No computador: globo 3D, baixado só quando o cartão está perto de aparecer na tela.
// No celular/tablet (tela pequena ou toque): globo em CSS, bem mais leve para a rolagem.
const LazyGlobe = ({size = 260, label}) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [viewRef, inView] = useInView('100px');
    const reducedMotion = usePrefersReducedMotion();
    const [lightweight] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia?.('(max-width: 1024px), (pointer: coarse)').matches
    );

    useEffect(() => {
        const el = ref.current;
        if (!el || visible || lightweight) return;
        if (!('IntersectionObserver' in window)) { setVisible(true); return; }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
        }, {rootMargin: '400px'});
        observer.observe(el);
        return () => observer.disconnect();
    }, [visible, lightweight]);

    const placeholder = <div className="rounded-full bg-black-300/60" style={{width: size * 0.75, height: size * 0.75}}/>;

    return (
        <div ref={(el) => { ref.current = el; viewRef.current = el; }} className="flex justify-center items-center pointer-events-none select-none"
             style={{width: size, height: size}} aria-hidden="true">
            {lightweight ? (
                <CssGlobe size={size} paused={!inView || reducedMotion}/>
            ) : visible ? (
                <Suspense fallback={placeholder}>
                    <SpinningGlobe size={size} label={label} rotate={!reducedMotion} active={inView}/>
                </Suspense>
            ) : placeholder}
        </div>
    );
};

export default LazyGlobe;
