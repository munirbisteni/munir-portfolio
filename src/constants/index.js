export const contactInfo = {
    email: 'munir.mlcb@gmail.com',
    phone: '+55 19 99596-5672',
    whatsapp: 'https://wa.me/5519995965672',
};

// Links do menu: `key` aponta para o texto em translations.nav
export const navLinks = [
    {id: 1, key: 'home', href: '#home'},
    {id: 2, key: 'about', href: '#about'},
    {id: 3, key: 'projects', href: '#projects'},
    {id: 4, key: 'work', href: '#work'},
    {id: 5, key: 'contact', href: '#contact'},
];

export const techStack = [
    'C# / .NET', 'APIs REST', 'JavaScript', 'TypeScript', 'React', 'Next.js',
    'React Native / Expo', 'Node.js', 'Python', 'SQL Server', 'MongoDB',
    'Linux', 'Docker', 'WordPress', 'Web Scraping',
];

// Telas do Capim (mockups do tema escuro, 390 × 844)
export const capimScreens = [
    '/projects/capim/01-mes.svg',
    '/projects/capim/02-container.svg',
    '/projects/capim/04-voz.svg',
    '/projects/capim/06-relatorios.svg',
    '/projects/capim/07-investimentos.svg',
    '/projects/capim/08-fechamento-mes.svg',
];

export const capimTags = ['React Native', 'Expo', 'TypeScript', 'Node.js', 'MongoDB', 'Claude API'];

// Projetos menores. `key` aponta para o texto em translations.projects
export const otherProjects = [
    {
        key: 'missoes',
        title: 'Missões e Cidade',
        image: '/projects/missoes.jpg',
        href: 'https://missoes-e-cidade-ibaviva.vercel.app',
        tags: ['React', 'Next.js', 'Vercel'],
    },
    {
        key: 'ic',
        visual: 'ic',
    },
];

// Mesa da tela inicial. `isShort` = telas baixas (ex.: notebook 1366×768): a mesa desce um pouco
// para não cobrir o título. Os demais objetos se posicionam sozinhos (components/HeroObjects.jsx).
export const calculateSizes = (isSmall, isMobile, isTablet, isShort) => {
    return {
        deskScale: isSmall ? 0.05 : isMobile ? 0.06 : isShort ? 0.058 : 0.065,
        deskPosition: isMobile ? [0.5, -4.5, 0] : isShort ? [0.25, -6.6, -2] : [0.25, -5.5, -2],
    };
};
