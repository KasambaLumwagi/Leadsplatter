import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';

function Funnel(props) {
    const mesh = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.x = Math.cos(t / 4) / 8;
        mesh.current.rotation.y = Math.sin(t / 4) / 8;
        mesh.current.position.y = Math.sin(t / 1.5) / 10;
    });
    return (
        <group {...props} ref={mesh}>
            <mesh rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[1, 1.5, 32, 1, true]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
            </mesh>
        </group>
    );
}

function Target(props) {
    const group = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        group.current.rotation.z = t / 2;
        group.current.rotation.x = Math.cos(t / 2) / 4;
    });

    return (
        <group {...props} ref={group}>
            <mesh>
                <torusGeometry args={[0.8, 0.1, 16, 100]} />
                <meshStandardMaterial color="#2563EB" metalness={0.5} roughness={0.1} emissive="#1d4ed8" emissiveIntensity={0.5} />
            </mesh>
            <mesh>
                <torusGeometry args={[0.5, 0.05, 16, 100]} />
                <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0} />
            </mesh>
        </group>
    );
}

function DataBlock(props) {
    const mesh = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.x = t / 3;
        mesh.current.rotation.y = t / 3;
    });
    return (
        <mesh {...props} ref={mesh}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.2} transparent opacity={0.8} />
        </mesh>
    );
}

function Coin(props) {
    const mesh = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.y = t;
    });
    return (
        <mesh {...props} ref={mesh} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
            <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
        </mesh>
    );
}

const Hero3DScene = () => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />

                {/* Cinematic Lighting */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} color="#D4AF37" />
                <pointLight position={[-10, -10, -10]} intensity={5} color="#2563EB" />

                {/* Floating Objects */}
                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    {/* The Funnel (Top Right) */}
                    <Funnel position={[4, 2, 0]} rotation={[0.2, 0, 0.2]} />

                    {/* The Target (Top Left) */}
                    <Target position={[-4, 1.5, -2]} />

                    {/* Data Blocks (Scattered) */}
                    <DataBlock position={[-3, -2, 2]} />
                    <DataBlock position={[3.5, -1.5, 1]} />

                    {/* Gold Coins (Profit) */}
                    <Coin position={[0, 3, -5]} />
                    <Coin position={[-2, 0, -3]} />
                    <Coin position={[2, -2, -3]} />
                </Float>

                <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.25} far={10} color="#000000" />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default Hero3DScene;
