import {useEffect, useState} from 'react'

// true quando a pessoa ativou "reduzir movimento" no sistema (celular ou computador).
const QUERY = '(prefers-reduced-motion: reduce)';

const usePrefersReducedMotion = () => {
    const [reduced, setReduced] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches
    );

    useEffect(() => {
        const media = window.matchMedia?.(QUERY);
        if (!media) return;
        const onChange = () => setReduced(media.matches);
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    return reduced;
};

export default usePrefersReducedMotion;
