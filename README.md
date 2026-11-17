# Portfólio · Munir Bisteni

Meu portfólio de desenvolvedor full-stack: quem sou, projetos, experiência e contato.

**No ar:** https://www.munirbisteni.com

## O que tem

- **Português e inglês:** todos os textos ficam em `src/i18n/translations.js`, com troca de idioma sem recarregar a página.
- **Cena 3D no topo** (Three.js com React Three Fiber) e globo com a minha localização, carregado só quando aparece na tela.
- **Respeita quem prefere menos movimento** (`prefers-reduced-motion`) e pausa as animações fora da tela, para pesar menos no celular.
- **Formulário de contato** que envia e-mail pelo EmailJS, sem back-end próprio.
- **Currículo em PDF** e prévia de link (Open Graph) para LinkedIn e WhatsApp.

## Tecnologias

React 18 · Vite · Tailwind CSS · Three.js / React Three Fiber · GSAP · EmailJS · Vercel

## Como rodar

```bash
npm install
npm run dev
```

## Estrutura

```
src/
  sections/   uma pasta por seção da página (Hero, About, Projects, Experience...)
  components/ objetos 3D, globo e botões
  i18n/       textos em português e inglês
  constants/  links, tecnologias e projetos
```
