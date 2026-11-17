import {useEffect, useRef, useState} from 'react'

// Diz se o elemento está (perto de estar) visível na tela. Usado para pausar
// animações e cenas 3D que estão fora da tela e só gastariam bateria e processamento.
const useInView = (rootMargin = '0px') => {
    const ref = useRef(null);
    const [inView, setInView] = useState(true);

    useEffect(() => {
        const el = ref.current;
        if (!el || !('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {rootMargin});
        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin]);

    return [ref, inView];
};

export default useInView;
