import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cloud, Sky, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const Rain = ({ count = 1000 }) => {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 20,
        speed: 0.2 + Math.random() * 0.2
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      particle.y -= particle.speed;
      
      if (particle.y < -10) {
        particle.y = 10;
        particle.x = (Math.random() - 0.5) * 20;
        particle.z = (Math.random() - 0.5) * 20;
      }
      
      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <boxGeometry args={[0.02, 0.5, 0.02]} />
      <meshBasicMaterial color="#aaddff" transparent opacity={0.4} />
    </instancedMesh>
  );
};

const Snow = ({ count = 500 }) => {
  const points = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame(() => {
    if (!points.current) return;
    const positions = points.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= 0.05; // Slower than rain
      positions[i * 3] += Math.sin(positions[i * 3 + 1]) * 0.01; // Wiggle
      
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] = 10;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

const Thunderstorm = () => {
  const light = useRef();
  
  useFrame(() => {
    if (Math.random() > 0.98) {
      light.current.intensity = 20;
      setTimeout(() => {
        if (light.current) light.current.intensity = 0;
      }, 100);
    }
  });

  return (
    <>
      <Rain count={1500} />
      <Cloud position={[0, 5, -5]} opacity={0.8} speed={0.4} segments={20} />
      <ambientLight intensity={0.2} />
      <pointLight ref={light} position={[0, 10, 0]} color="#aaddff" intensity={0} distance={50} />
    </>
  );
};

const CloudsEffect = () => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <Cloud position={[-4, 2, -5]} speed={0.2} opacity={0.5} />
      <Cloud position={[4, 2, -10]} speed={0.2} opacity={0.5} />
      <Cloud position={[0, 5, -15]} speed={0.2} opacity={0.5} />
    </>
  );
};

const ClearSky = () => {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={1} />
      <Sparkles count={50} scale={12} size={4} speed={0.4} opacity={0.5} color="#ffdd00" />
    </>
  );
};

const FogEffect = () => {
  return (
    <>
      <fog attach="fog" args={['#cccccc', 0, 15]} />
      <ambientLight intensity={0.5} />
      <Cloud position={[0, 0, -5]} speed={0.1} opacity={0.2} />
    </>
  );
};

const WeatherBackground = ({ weather }) => {
  const getScene = () => {
    switch (weather) {
      case 'clear':
        return <ClearSky />;
      case 'clouds':
        return <CloudsEffect />;
      case 'rain':
      case 'drizzle':
        return (
          <>
            <ambientLight intensity={0.5} />
            <Rain count={weather === 'drizzle' ? 500 : 1000} />
            <Cloud position={[0, 5, -5]} opacity={0.5} />
          </>
        );
      case 'snow':
        return (
          <>
            <ambientLight intensity={0.8} />
            <Snow />
            <Cloud position={[0, 5, -5]} opacity={0.3} color="#eeeeee" />
          </>
        );
      case 'thunderstorm':
        return <Thunderstorm />;
      case 'mist':
      case 'fog':
      case 'haze':
        return <FogEffect />;
      default:
        return <ClearSky />;
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        {getScene()}
      </Canvas>
    </div>
  );
};

export default WeatherBackground;
