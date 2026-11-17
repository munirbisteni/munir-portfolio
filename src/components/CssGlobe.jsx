import React from 'react'

// Globo leve para celular: o mapa noturno da Terra desliza dentro de um círculo e uma camada
// de sombreamento dá volume. Não usa WebGL; a animação é só `transform`, que o navegador
// faz na placa de vídeo sem redesenhar a página.
// O mapa vai de -180° a 180°; Valinhos (-47°) fica a ~37% da largura. Começa centralizado ali.
const CssGlobe = ({size = 260, paused = false}) => {
    const mapWidth = size * 2;                 // a textura tem proporção 2:1
    const start = size / 2 - mapWidth * 0.37;  // desloca para Valinhos ficar no centro

    return (
        <div className="relative rounded-full overflow-hidden"
             style={{width: size, height: size, boxShadow: '0 0 45px 6px rgba(70, 130, 255, 0.22)'}}>
            <div className="css-globe-map absolute top-0 h-full"
                 style={{
                     width: mapWidth * 2,
                     left: start - mapWidth,
                     backgroundImage: 'url(/textures/globe/earth-night-1024.jpg)',
                     backgroundSize: `${mapWidth}px ${size}px`,
                     backgroundRepeat: 'repeat-x',
                     '--globe-shift': `${mapWidth}px`,
                     animationPlayState: paused ? 'paused' : 'running',
                 }}/>
            {/* Sombreamento: luz vinda de cima à esquerda, borda escura e brilho azul da atmosfera */}
            <div className="absolute inset-0 rounded-full"
                 style={{
                     background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%), radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 85%, rgba(0,0,0,0.9) 100%)',
                     boxShadow: 'inset 0 0 18px 2px rgba(90, 150, 255, 0.35)',
                 }}/>
        </div>
    );
};

export default CssGlobe;
