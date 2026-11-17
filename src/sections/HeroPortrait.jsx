import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {useLanguage} from "../i18n/LanguageContext.jsx";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";
import useInView from "../hooks/useInView.js";

// PRÉVIA: capa "você como sujeito da sua própria pesquisa".
// Marcação: [palavra|T], onde T é o traço: O, C, E, A, N (ordem dos Big Five).
//
// Sequência: 1) a resposta é digitada e as palavras ganham a cor do traço;
// 2) as palavras formam uma roda em volta do avatar;
// 3) o avatar sobe para o lado da pergunta e as palavras sobem e caem nas barras dos traços.
// Não há números na tela: só a altura relativa das barras.

const TRAITS = ['O', 'C', 'E', 'A', 'N'];
const TRAIT_COLOR = {O: '#a78bfa', C: '#60a5fa', E: '#fbbf24', A: '#34d399', N: '#fb7185'};

// Preenchimento final das barras (0 a 1). Valores ilustrativos, não são escores reais
// e não aparecem na tela.
const PROFILE = {O: 0.74, C: 0.7, E: 0.86, A: 0.9, N: 0.22};

const content = {
    pt: {
        greeting: 'Oi, eu sou o Munir',
        role: 'Desenvolvedor Full-Stack',
        tagline: 'Do problema à produção.',
        experience: 'Programo sistemas. Estudo pessoas.',
        stack: ['C# / .NET', 'React', 'Node.js', 'TypeScript'],
        ctaProjects: 'Ver projetos',
        ctaResume: 'Currículo',
        location: 'Valinhos/SP · presencial, híbrido ou remoto',
        label: 'Iniciação científica · PLN e personalidade',
        question: '“Como você descreveria, em detalhes, sua personalidade?”',
        answer: 'Sou [curioso|O] e gosto de [ideias novas|O], principalmente sobre [pessoas|A]: como pensam, decidem e trabalham. Antes de construir, prefiro [ouvir|A] quem vai usar. Sou [organizado|C] e levo as coisas [até o fim|C]. Gosto de [conversar|E] e não hesito em [assumir a frente|E] quando precisa. E confesso: me [preocupo|N] com cada [detalhe|C].',
        done: 'Cada palavra marcada soma na barra do seu traço.',
        replay: 'Ver de novo',
        note: 'Ilustração inspirada na minha iniciação científica, que mede personalidade a partir de textos livres. Não há escores reais aqui.',
        avatarAlt: 'Avatar de Munir Bisteni',
    },
    en: {
        greeting: "Hi, I'm Munir",
        role: 'Full-Stack Developer',
        tagline: 'From problem to production.',
        experience: 'I build systems. I study people.',
        stack: ['C# / .NET', 'React', 'Node.js', 'TypeScript'],
        ctaProjects: 'See projects',
        ctaResume: 'Résumé',
        location: 'Valinhos, Brazil · on-site, hybrid or remote',
        label: 'Undergraduate research · NLP and personality',
        question: '“How would you describe your personality in detail?”',
        answer: "I'm [curious|O] and drawn to [new ideas|O], especially about [people|A]: how they think, decide and work. Before building, I'd rather [listen|A] to who will use it. I'm [organized|C] and I see things [through to the end|C]. I like to [talk things through|E] and I don't hesitate to [take the lead|E] when needed. And I'll admit it: I [worry|N] about every [detail|C].",
        done: 'Each highlighted word adds to the bar of its trait.',
        replay: 'Play again',
        note: 'Illustration inspired by my undergraduate research, which measures personality from free-form text. No real scores here.',
        avatarAlt: 'Avatar of Munir Bisteni',
    },
};

// "Sou [curioso|O] e..." -> [{text: 'Sou '}, {text: 'curioso', trait: 'O'}, {text: ' e...'}]
const parseAnswer = (answer) => {
    const segments = [];
    const re = /\[([^\]|]+)\|([OCEAN])\]/g;
    let last = 0;
    let match;
    while ((match = re.exec(answer))) {
        if (match.index > last) segments.push({text: answer.slice(last, match.index)});
        segments.push({text: match[1], trait: match[2]});
        last = re.lastIndex;
    }
    if (last < answer.length) segments.push({text: answer.slice(last)});
    let offset = 0;
    return segments.map((s) => {
        const seg = {...s, start: offset, end: offset + s.text.length};
        offset = seg.end;
        return seg;
    });
};

const charDelay = (ch) => (/[.:]/.test(ch) ? 200 : ch === ',' ? 100 : 10 + Math.random() * 14);

const EMPTY_FILLS = {O: 0, C: 0, E: 0, A: 0, N: 0};
const AVATAR_SMALL = 48;

// Afasta as palavras umas das outras e do avatar, sem sair da área permitida.
const relax = (items, {cx, cy, avatarR, minX, maxX, minY, maxY}) => {
    const clamp = (it) => {
        it.x = Math.min(Math.max(it.x, minX + it.w / 2), maxX - it.w / 2);
        it.y = Math.min(Math.max(it.y, minY + it.h / 2), maxY - it.h / 2);
    };
    for (let iter = 0; iter < 150; iter++) {
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const a = items[i], b = items[j];
                const ox = (a.w + b.w) / 2 + 8 - Math.abs(a.x - b.x);
                const oy = (a.h + b.h) / 2 + 6 - Math.abs(a.y - b.y);
                if (ox > 0 && oy > 0) {
                    if (ox < oy) { const d = (a.x < b.x ? -1 : 1) * ox / 2; a.x += d; b.x -= d; }
                    else { const d = (a.y < b.y ? -1 : 1) * oy / 2; a.y += d; b.y -= d; }
                }
            }
        }
        for (const it of items) {
            const px = Math.min(Math.max(cx, it.x - it.w / 2), it.x + it.w / 2);
            const py = Math.min(Math.max(cy, it.y - it.h / 2), it.y + it.h / 2);
            const dist = Math.hypot(px - cx, py - cy);
            if (dist < avatarR) {
                const vx = it.x - cx, vy = it.y - cy;
                const len = Math.hypot(vx, vy) || 1;
                const push = avatarR - dist + 1;
                it.x += (vx / len) * push;
                it.y += (vy / len) * push;
            }
            clamp(it);
        }
    }
};

// Onda neon na barra quando uma gota cai nela: um brilho percorre a barra de cima para baixo
// e o contorno pulsa em neon da cor do traço.
const neonWave = (bar, wave, color) => {
    if (!bar || !wave) return;
    bar.animate([
        {boxShadow: `0 0 0px ${color}00, inset 0 2px 0 rgba(255,255,255,.18)`, filter: 'brightness(1)'},
        {offset: 0.2, boxShadow: `0 0 18px ${color}, 0 0 46px ${color}99, inset 0 2px 0 rgba(255,255,255,.5)`, filter: 'brightness(1.3)'},
        {boxShadow: `0 0 22px ${color}33, inset 0 2px 0 rgba(255,255,255,.18)`, filter: 'brightness(1)'},
    ], {duration: 1000, easing: 'ease-out'});
    wave.animate([
        {transform: 'translateY(-100%)', opacity: 0},
        {offset: 0.12, opacity: 1},
        {transform: 'translateY(260%)', opacity: 0},
    ], {duration: 950, easing: 'cubic-bezier(.3,.6,.4,1)'});
};

const HeroPortrait = () => {
    const {lang, t} = useLanguage();
    const c = content[lang];
    const traitNames = t.projects.ic.factors; // Abertura, Conscienciosidade, Extroversão, Amabilidade, Neuroticismo
    const reducedMotion = usePrefersReducedMotion();
    const [figureRef, inView] = useInView('0px 0px -30% 0px'); // começa quando o cartão aparece

    const segments = useMemo(() => parseAnswer(c.answer), [c.answer]);
    const plain = useMemo(() => segments.map((s) => s.text).join(''), [segments]);
    const total = segments.length ? segments[segments.length - 1].end : 0;
    const tagged = useMemo(() => segments.filter((s) => s.trait), [segments]);

    const [typed, setTyped] = useState(0);
    const [started, setStarted] = useState(false);
    const [phase, setPhase] = useState('typing'); // typing -> ring -> bars
    const [geo, setGeo] = useState(null);         // posições calculadas (roda, avatar, barras)
    const [fills, setFills] = useState(EMPTY_FILLS);
    const [settled, setSettled] = useState(false);

    const cardRef = useRef(null);
    const headRef = useRef(null);  // rótulo + pergunta
    const wordRefs = useRef({});
    const flyerRefs = useRef({});
    const animsRef = useRef([]);
    const fillRefs = useRef({});   // preenchimento de cada barra (para a gota parar no topo real)
    const waveRefs = useRef({});   // brilho da onda neon dentro de cada barra

    const stopAnims = () => {
        animsRef.current.forEach((a) => a.cancel());
        animsRef.current = [];
    };

    const restart = useCallback(() => {
        stopAnims();
        setGeo(null);
        setFills(EMPTY_FILLS);
        setSettled(false);
        setPhase('typing');
        setTyped(0);
    }, []);

    useEffect(() => { restart(); }, [lang, restart]);
    useEffect(() => () => stopAnims(), []);

    // Começa a digitar quando o cartão aparece
    useEffect(() => {
        if (inView && !started) {
            const id = setTimeout(() => setStarted(true), 500);
            return () => clearTimeout(id);
        }
    }, [inView, started]);

    // Digitação
    useEffect(() => {
        if (!started || phase !== 'typing') return;
        if (reducedMotion) { setTyped(total); return; }
        if (typed >= total) return;
        const id = setTimeout(() => setTyped((n) => n + 1), charDelay(plain[typed]));
        return () => clearTimeout(id);
    }, [started, phase, typed, total, reducedMotion, plain]);

    // Medidas básicas do cartão
    const measureCard = () => {
        const box = cardRef.current.getBoundingClientRect();
        const W = box.width;
        const H = box.height;
        const wide = W >= 480;
        return {box, W, H, wide, pad: wide ? 28 : 20, legend: wide ? 52 : 64};
    };

    // Etapa 2: roda de palavras em volta do avatar
    const buildRing = useCallback(() => {
        const {box, W, H, wide, pad, legend} = measureCard();
        const cx = W / 2;
        const cy = (H - legend) / 2 + 12;
        const avatarSize = wide ? 112 : 96;
        const avatarR = avatarSize / 2 + 14;
        const rx = Math.max(avatarR + 40, W / 2 - (wide ? 90 : 70));
        const ry = Math.max(avatarR + 30, (H - legend) / 2 - 40);
        const ordered = [...tagged].sort((a, b) => TRAITS.indexOf(a.trait) - TRAITS.indexOf(b.trait));
        // Mede cada palavra numa linha só (no texto, "assumir a frente" pode quebrar em duas
        // linhas, e a caixa dela ficaria com a largura da linha inteira).
        const probe = document.createElement('span');
        probe.className = 'absolute invisible whitespace-nowrap rounded px-0.5 sm:text-lg text-[15px] leading-relaxed font-medium';
        cardRef.current.appendChild(probe);
        const sizeOf = (text) => { probe.textContent = text; return {w: probe.offsetWidth, h: probe.offsetHeight}; };

        const items = ordered.map((seg, i) => {
            const el = wordRefs.current[seg.start];
            const first = el?.getClientRects()[0]; // posição do começo da palavra no texto
            const r = first || {left: box.left + cx, top: box.top + cy};
            const {w, h} = sizeOf(seg.text);
            const angle = -Math.PI / 2 + (i / ordered.length) * Math.PI * 2;
            return {
                key: seg.start, text: seg.text, trait: seg.trait, order: i,
                w, h,
                from: {x: r.left - box.left, y: r.top - box.top},
                x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry,
            };
        });
        probe.remove();
        relax(items, {cx, cy, avatarR, minX: 8, maxX: W - 8, minY: 12, maxY: H - legend});
        const words = items.map((it) => ({...it, ring: {x: it.x - it.w / 2, y: it.y - it.h / 2}}));
        return {W, H, wide, pad, words, avatar: {x: cx, y: cy, size: avatarSize}};
    }, [tagged]);

    // Etapa 3: barras embaixo da pergunta (com o avatar ao lado dela)
    const buildBars = useCallback((base) => {
        const {box, W, H, wide, pad} = measureCard();
        const head = headRef.current;
        // mede a pergunta já com o espaço do avatar à esquerda (como ficará na etapa 3)
        const prev = head.style.paddingLeft;
        const prevTransition = head.style.transition;
        head.style.transition = 'none';
        head.style.paddingLeft = `${AVATAR_SMALL + 14}px`;
        const hr = head.getBoundingClientRect();
        head.style.paddingLeft = prev;
        void head.offsetHeight;
        head.style.transition = prevTransition;

        const headTop = hr.top - box.top;
        const headBottom = hr.bottom - box.top;
        const areaTop = Math.max(headBottom, headTop + AVATAR_SMALL) + 46; // espaço para as palavras subirem sem cobrir a pergunta
        const areaBottom = H - pad - (wide ? 26 : 56);
        const gap = wide ? 18 : 10;
        const colW = (W - pad * 2 - gap * 4) / 5;
        const columns = TRAITS.map((tr, i) => ({trait: tr, x: pad + i * (colW + gap), w: colW}));
        const counts = Object.fromEntries(TRAITS.map((tr) => [tr, tagged.filter((s) => s.trait === tr).length]));
        return {
            ...base,
            bars: {columns, top: areaTop, bottom: areaBottom, h: areaBottom - areaTop, labelTop: areaBottom + 8, counts},
            avatarSmall: {x: pad + AVATAR_SMALL / 2, y: headTop + Math.min(hr.height, Math.max(AVATAR_SMALL, hr.height)) / 2, size: AVATAR_SMALL},
        };
    }, [tagged]);

    // Fim da digitação -> roda (ou direto para as barras, se a pessoa prefere menos movimento)
    useEffect(() => {
        if (phase !== 'typing' || typed < total || !started) return;
        const id = setTimeout(() => {
            const ring = buildRing();
            if (reducedMotion) {
                setGeo(buildBars(ring));
                setFills(PROFILE);
                setPhase('bars');
                setSettled(true);
            } else {
                setGeo(ring);
                setPhase('ring');
            }
        }, reducedMotion ? 0 : 900);
        return () => clearTimeout(id);
    }, [phase, typed, total, started, buildRing, buildBars, reducedMotion]);

    // Etapa 2: palavras voam do texto até a roda; depois de uma pausa, vai para a etapa 3
    useLayoutEffect(() => {
        if (phase !== 'ring' || !geo) return;
        const anims = geo.words.map((w) => {
            const el = flyerRefs.current[w.key];
            if (!el) return null;
            return el.animate([
                {transform: `translate(${w.from.x}px, ${w.from.y}px)`},
                {transform: `translate(${w.ring.x}px, ${w.ring.y}px)`},
            ], {duration: 1000, delay: w.order * 70, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards'});
        }).filter(Boolean);
        animsRef.current.push(...anims);
        let timer;
        let cancelled = false;
        Promise.all(anims.map((a) => a.finished)).then(() => {
            if (cancelled) return;
            timer = setTimeout(() => {
                setGeo((g) => buildBars(g));
                setPhase('bars');
            }, 1600);
        }).catch(() => {});
        return () => { cancelled = true; clearTimeout(timer); };
    }, [phase, geo, buildBars]);

    // Etapa 3: assim que a roda se desfaz, as palavras viram bolinhas da cor do traço.
    // Cada bolinha desliza até ficar acima da SUA coluna e cai com gravidade; enquanto se move,
    // estica na direção do movimento (como gota arrastada). Ao encostar na superfície do
    // preenchimento, achata, respinga e a barra sobe.
    useLayoutEffect(() => {
        if (phase !== 'bars' || !geo?.bars || reducedMotion) return;
        const {bars} = geo;
        let cancelled = false;
        let raf = 0;
        const timers = [];
        const D = geo.wide ? 16 : 14;     // diâmetro da gota
        const GATHER = 560;               // palavra -> bolinha, indo para a faixa de espera
        const START = 700;                // primeira queda
        const STAGGER = 260;              // entre uma gota e a próxima
        const SWOOP = 620;                // deslizar até acima da coluna
        const G = 2400;                   // gravidade (px/s²)

        // as animações da roda prendem a posição; solta para controlar quadro a quadro
        animsRef.current.forEach((a) => a.cancel());
        animsRef.current = [];

        // Ordem alternando as colunas (O, C, E, A, N, O, C...): cada barra já subiu quando chega a próxima gota dela
        const byTrait = TRAITS.map((tr) => geo.words.filter((w) => w.trait === tr));
        const queue = [];
        for (let round = 0; queue.length < geo.words.length; round++) {
            byTrait.forEach((list) => { if (list[round]) queue.push(list[round]); });
        }

        const drops = queue.map((w, i) => {
            const el = flyerRefs.current[w.key];
            const color = TRAIT_COLOR[w.trait];
            const col = bars.columns[TRAITS.indexOf(w.trait)];
            const share = PROFILE[w.trait] / Math.max(1, bars.counts[w.trait]);
            const p0 = {x: w.ring.x + w.w / 2, y: w.ring.y + w.h / 2}; // centro da palavra na roda
            // espera numa faixa logo acima das barras (duas fileiras, para não se sobreporem)
            const hold = {x: Math.min(Math.max(p0.x, geo.pad + D), geo.W - geo.pad - D), y: bars.top - (i % 2 ? D * 2.3 : D)};
            const apex = {x: col.x + col.w / 2, y: bars.top - D};
            return {
                el, w, i, color, share, p0, hold, apex,
                ctrl: {x: (hold.x + apex.x) / 2, y: Math.min(hold.y, apex.y) - 34}, // pulinho até a coluna
                gatherAt: i * 30,
                startAt: START + i * STAGGER,
                state: 'gather', x: p0.x, y: p0.y, px: p0.x, py: p0.y, fallStart: 0,
            };
        }).filter((d) => d.el);

        // 1) palavra -> bolinha (tamanho e cor; a posição é controlada quadro a quadro)
        drops.forEach((d) => {
            const {el, w, color} = d;
            el.style.transformOrigin = '50% 50%';
            const shrink = el.animate([
                {width: `${w.w}px`, height: `${w.h}px`, borderRadius: '4px', color, backgroundColor: `${color}22`},
                {width: `${D}px`, height: `${D}px`, borderRadius: '50%', color: `${color}00`, backgroundColor: color},
            ], {duration: 340, delay: d.gatherAt, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards'});
            shrink.finished.then(() => {
                if (cancelled) return;
                shrink.commitStyles(); // fixa o estado final no estilo e libera a animação
                shrink.cancel();
            }).catch(() => {});
        });

        const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        const bez = (a, c, b, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;
        const place = (d, now, dt) => {
            const vx = (d.x - d.px) / dt;
            const vy = (d.y - d.py) / dt;
            const speed = Math.hypot(vx, vy);
            const cw = d.el.offsetWidth;  // ainda pode estar encolhendo de palavra para bolinha
            const ch = d.el.offsetHeight;
            const isBall = cw < D * 1.6;
            const stretch = isBall ? Math.min(0.75, speed / 1500) : 0;
            const angle = isBall && speed > 1 ? Math.atan2(vy, vx) : 0;
            d.el.style.transform = `translate(${d.x - cw / 2}px, ${d.y - ch / 2}px) rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.4})`;
        };

        const t0 = performance.now();
        let last = t0;
        const tick = (now) => {
            if (cancelled) return;
            const t = now - t0;
            const dt = Math.max(1, now - last) / 1000;
            last = now;
            let alive = 0;
            for (const d of drops) {
                d.px = d.x; d.py = d.y;
                if (d.state === 'gather') {
                    alive++;
                    const k = ease(Math.min(1, Math.max(0, (t - d.gatherAt) / GATHER)));
                    d.x = d.p0.x + (d.hold.x - d.p0.x) * k;
                    d.y = d.p0.y + (d.hold.y - d.p0.y) * k;
                    place(d, now, dt);
                    if (k >= 1) d.state = 'wait';
                } else if (d.state === 'wait') {
                    alive++;
                    if (t >= d.startAt) d.state = 'swoop';
                    else { // boiando enquanto espera a vez
                        d.x = d.hold.x;
                        d.y = d.hold.y + Math.sin(t / 260 + d.i) * 2.5;
                        place(d, now, dt);
                    }
                }
                if (d.state === 'swoop') {
                    alive++;
                    const k = ease(Math.min(1, (t - d.startAt) / SWOOP));
                    d.x = bez(d.hold.x, d.ctrl.x, d.apex.x, k);
                    d.y = bez(d.hold.y, d.ctrl.y, d.apex.y, k);
                    place(d, now, dt);
                    if (k >= 1) { d.state = 'fall'; d.fallStart = t; }
                } else if (d.state === 'fall') {
                    alive++;
                    const s = (t - d.fallStart) / 1000;
                    d.x = d.apex.x;
                    d.y = d.apex.y + 0.5 * G * s * s;
                    // topo REAL da barra neste quadro (ela pode estar crescendo)
                    const bar = fillRefs.current[d.w.trait];
                    const top = bar ? bar.offsetTop : bars.bottom;
                    const landY = top - D / 2;
                    if (d.y >= landY) {
                        d.y = landY;
                        d.state = 'done';
                        // 2) encosta: a gota é absorvida, a barra acende em onda neon e sobe
                        d.el.style.transform = `translate(${d.x - D / 2}px, ${landY - D / 2}px)`;
                        d.el.animate([{opacity: 1}, {opacity: 0}], {duration: 90, fill: 'forwards'});
                        neonWave(bar, waveRefs.current[d.w.trait], d.color);
                        setFills((f) => ({...f, [d.w.trait]: Math.min(1, f[d.w.trait] + d.share)}));
                    } else {
                        place(d, now, dt);
                    }
                }
            }
            if (alive) raf = requestAnimationFrame(tick);
            else {
                setFills((f) => ({...f, ...Object.fromEntries(TRAITS.filter((tr) => !bars.counts[tr]).map((tr) => [tr, PROFILE[tr]]))}));
                timers.push(setTimeout(() => { if (!cancelled) setSettled(true); }, 600));
            }
        };
        raf = requestAnimationFrame(tick);

        return () => { cancelled = true; cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
    }, [phase, geo, reducedMotion]);

    // Se a largura da tela mudar no meio da animação, recomeça (as posições dependem da largura)
    useEffect(() => {
        if (phase === 'typing') return;
        let width = window.innerWidth; // só a largura: no celular a altura muda ao rolar
        const onResize = () => { if (window.innerWidth !== width) { width = window.innerWidth; restart(); } };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [phase, restart]);

    const litTraits = new Set(tagged.filter((s) => typed >= s.end).map((s) => s.trait));
    const ring = phase === 'ring';
    const bars = phase === 'bars' && geo?.bars;
    const showLegend = !bars || !geo.wide;

    // Avatar: escondido na digitação, no centro da roda, depois pequeno ao lado da pergunta
    const av = bars ? geo.avatarSmall : geo?.avatar;
    const avatarStyle = av
        ? {left: av.x - av.size / 2, top: av.y - av.size / 2, width: av.size, height: av.size, opacity: 1, transform: 'scale(1)'}
        : {left: 'calc(50% - 48px)', top: 'calc(50% - 48px)', width: 96, height: 96, opacity: 0, transform: 'scale(.6)'};

    return (
        <section id="home" className="min-h-screen w-full c-space flex items-center pt-28 pb-12 sm:pt-32">
            <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center w-full">
                {/* Quem sou */}
                <div className="flex flex-col gap-5">
                    <p className="sm:text-2xl text-xl font-medium text-white font-generalsans">
                        {c.greeting} <span className="waving-hand">👋</span>
                    </p>
                    <h1 className="font-generalsans font-black tracking-tight leading-[1.05] xl:text-6xl md:text-5xl text-4xl text-gray_gradient">
                        {c.role.split(' ').map((part, i) => <span key={i} className="block">{part.replace('-', '‑')}</span>)}
                    </h1>
                    <p className="text-white-600 sm:text-lg text-base max-w-xl">
                        <span className="text-white-800 font-medium">{c.tagline}</span> {c.experience}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                        {c.stack.map((s) => (
                            <li key={s} className="rounded-full border border-black-300 bg-black-200 px-3 py-1 text-sm text-white-700">{s}</li>
                        ))}
                    </ul>
                    <div className="flex flex-wrap gap-3 mt-2">
                        <a href="#projects" className="rounded-md bg-white text-black font-medium px-5 py-3 hover:bg-white-700 transition-colors">
                            {c.ctaProjects}
                        </a>
                        <a href="#work" className="rounded-md border border-black-300 bg-black-200 text-white px-5 py-3 hover:bg-black-300 transition-colors">
                            {c.ctaResume}
                        </a>
                    </div>
                    <p className="text-sm text-white-500">{c.location}</p>
                </div>

                {/* Retrato */}
                <figure ref={figureRef} className="flex flex-col gap-3">
                    <div ref={cardRef}
                         className="relative overflow-hidden rounded-2xl border border-black-300 bg-black-200 sm:p-7 p-5 h-[470px] sm:h-[450px]">
                        <p className="sr-only">{c.question} {plain}</p>

                        <div aria-hidden="true" className="relative h-full flex flex-col">
                            {/* Rótulo + pergunta (some na roda; volta com o avatar ao lado) */}
                            <div ref={headRef} className="transition-[opacity,padding] duration-700 ease-out min-h-0"
                                 style={{opacity: ring ? 0 : 1, paddingLeft: bars ? AVATAR_SMALL + 14 : 0,
                                     transitionDelay: bars && !reducedMotion ? '1500ms, 0ms' : '0ms'}}>
                                <p className="text-xs uppercase tracking-wider text-white-500">{c.label}</p>
                                <p className="mt-2 text-white-800 italic font-medium sm:text-lg">{c.question}</p>
                            </div>

                            {/* Resposta sendo digitada */}
                            <p className="mt-4 sm:text-lg text-[15px] leading-relaxed text-white-600 transition-opacity duration-500"
                               style={{opacity: phase === 'typing' ? 1 : 0}}>
                                {segments.map((seg) => {
                                    if (typed <= seg.start) return null;
                                    const shown = seg.text.slice(0, Math.max(0, typed - seg.start));
                                    if (!seg.trait) return <span key={seg.start}>{shown}</span>;
                                    const done = typed >= seg.end;
                                    const color = TRAIT_COLOR[seg.trait];
                                    return (
                                        <span key={seg.start}
                                              ref={(el) => { wordRefs.current[seg.start] = el; }}
                                              className="rounded px-0.5 -mx-0.5 transition-colors duration-500"
                                              style={done ? {color, backgroundColor: `${color}22`} : undefined}>
                                            {shown}
                                        </span>
                                    );
                                })}
                                {phase === 'typing' && <span className="inline-block w-[2px] h-[1.1em] align-[-0.2em] ml-0.5 bg-white-700 animate-pulse"/>}
                            </p>

                            {/* Legenda dos traços (no largo, na etapa das barras, vira o nome embaixo de cada barra) */}
                            <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 text-xs transition-opacity duration-500"
                                style={{opacity: showLegend ? 1 : 0}}>
                                {TRAITS.map((tr, i) => (
                                    <li key={tr} className="flex items-center gap-1.5 transition-opacity duration-500"
                                        style={{opacity: phase !== 'typing' || litTraits.has(tr) ? 1 : 0.25}}>
                                        <span className="w-2 h-2 rounded-full" style={{backgroundColor: TRAIT_COLOR[tr]}}/>
                                        <span className="text-white-600">{traitNames[i]}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Barras: só o preenchimento (sem trilho de 100%), com uma linha fina de base */}
                        {bars && geo.bars.columns.map((col, i) => {
                            const color = TRAIT_COLOR[col.trait];
                            const fillH = fills[col.trait] * geo.bars.h;
                            return (
                                <div key={col.trait} aria-hidden="true">
                                    <div className="absolute rounded-full animate-[fadeIn_.6s_ease-out_both]"
                                         style={{left: col.x, top: geo.bars.bottom - 1, width: col.w, height: 2, backgroundColor: `${color}55`}}/>
                                    <div ref={(el) => { fillRefs.current[col.trait] = el; }}
                                         className="absolute overflow-hidden rounded-lg transition-[height,top] duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)]"
                                         style={{left: col.x, width: col.w, top: geo.bars.bottom - fillH, height: fillH,
                                             background: `linear-gradient(to top, ${color}, ${color}b3)`,
                                             boxShadow: fillH > 0 ? `0 0 22px ${color}33, inset 0 2px 0 rgba(255,255,255,.18)` : 'none'}}>
                                        <div ref={(el) => { waveRefs.current[col.trait] = el; }}
                                             className="absolute inset-x-0 top-0 h-2/5 opacity-0 mix-blend-screen pointer-events-none"
                                             style={{background: `linear-gradient(to bottom, transparent, rgba(255,255,255,.75), ${color}, transparent)`}}/>
                                    </div>
                                    {geo.wide && (
                                        <p className="absolute text-center text-[11px] leading-tight text-white-600 animate-[fadeIn_.6s_ease-out_both]"
                                           style={{left: col.x - 6, width: col.w + 12, top: geo.bars.labelTop}}>
                                            {traitNames[i]}
                                        </p>
                                    )}
                                </div>
                            );
                        })}

                        {/* Avatar (a moldura quadrada da imagem fica fora do círculo graças ao zoom) */}
                        <div aria-hidden="true"
                             className="absolute transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
                             style={avatarStyle}>
                            <div className="absolute -inset-3 rounded-full blur-xl transition-opacity duration-700"
                                 style={{opacity: ring ? 0.45 : 0, background: 'conic-gradient(from 0deg, #a78bfa, #60a5fa, #fbbf24, #34d399, #fb7185, #a78bfa)'}}/>
                            <div className="relative w-full h-full rounded-full overflow-hidden bg-[#0b0b0b] ring-1 ring-white/10">
                                <img src="/assets/avatar.webp" alt={c.avatarAlt} className="w-full h-full object-cover scale-[1.24] translate-y-[3%]"/>
                            </div>
                        </div>

                        {/* Palavras (texto -> roda -> barras) */}
                        {(ring || bars) && geo.words.map((w) => (
                            <span key={w.key} aria-hidden="true"
                                  ref={(el) => { flyerRefs.current[w.key] = el; }}
                                  className="absolute left-0 top-0 flex items-center justify-center overflow-hidden whitespace-nowrap rounded px-0.5 sm:text-lg text-[15px] leading-relaxed font-medium"
                                  style={{
                                      transformOrigin: '50% 100%',
                                      width: w.w,
                                      height: w.h,
                                      transform: `translate(${(bars ? w.ring : w.from).x}px, ${(bars ? w.ring : w.from).y}px)`,
                                      opacity: reducedMotion && bars ? 0 : 1,
                                      color: TRAIT_COLOR[w.trait],
                                      backgroundColor: `${TRAIT_COLOR[w.trait]}22`,
                                  }}>
                                {w.text}
                            </span>
                        ))}
                    </div>
                    <figcaption className="flex items-start justify-between gap-4 text-xs text-white-500">
                        <span>{settled ? `${c.done} ` : ''}{c.note}</span>
                        <button type="button" onClick={restart}
                                className="shrink-0 rounded-full border border-black-300 bg-black-200 px-3 py-1 text-white-700 hover:text-white transition-all"
                                style={{opacity: settled ? 1 : 0, pointerEvents: settled ? 'auto' : 'none'}}>
                            ↻ {c.replay}
                        </button>
                    </figcaption>
                </figure>
            </div>
        </section>
    );
};

export default HeroPortrait;
