import React, {useRef} from 'react'

import gsap from 'gsap';
import {useGSAP} from "@gsap/react";

// Alvo construído localmente (antes vinha de um .gltf hospedado num Supabase que saiu do ar).
const RINGS = [
    {radius: 1, color: '#e63946'},
    {radius: 0.8, color: '#f1faee'},
    {radius: 0.6, color: '#e63946'},
    {radius: 0.4, color: '#f1faee'},
    {radius: 0.2, color: '#e63946'},
];

const Target = (props) => {
    const targetRef = useRef();

    useGSAP(() => {
        gsap.to(
            targetRef.current.position, {
                y: targetRef.current.position.y + 0.5,
                duration: 1.5,
                repeat: -1,
                yoyo: true
            })
    })

    return (
        <group {...props} rotation={[0, Math.PI / 5, 0]} scale={1.5} ref={targetRef}>
            {/* face do alvo */}
            <group position={[0, 1.6, 0]}>
                {RINGS.map(({radius, color}, i) => (
                    <mesh key={radius} position={[0, 0, i * 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[radius, radius, 0.1, 48]}/>
                        <meshStandardMaterial color={color}/>
                    </mesh>
                ))}
            </group>
            {/* suporte */}
            <mesh position={[0, 0.5, -0.1]}>
                <cylinderGeometry args={[0.06, 0.06, 1.4, 16]}/>
                <meshStandardMaterial color="#8d6e63"/>
            </mesh>
            <mesh position={[0, -0.2, -0.1]}>
                <cylinderGeometry args={[0.5, 0.6, 0.12, 32]}/>
                <meshStandardMaterial color="#5d4037"/>
            </mesh>
        </group>
    )
}
export default Target
