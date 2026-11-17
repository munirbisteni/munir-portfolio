import React from 'react'

// Evita que uma falha ao carregar um modelo/textura 3D derrube a página inteira.
class SceneErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidCatch(error) {
        console.error('Falha ao renderizar cena 3D:', error);
    }

    render() {
        if (this.state.hasError) return this.props.fallback ?? null;
        return this.props.children;
    }
}

export default SceneErrorBoundary
