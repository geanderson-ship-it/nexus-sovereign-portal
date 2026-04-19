'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

function Orb() {
  const ref = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_intensity: { value: 0.3 },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (materialRef.current && materialRef.current.userData.uniforms) {
      materialRef.current.userData.uniforms.u_time.value = clock.getElapsedTime();
      ref.current.rotation.y += 0.001;
      ref.current.rotation.x += 0.0005;
    }
  });

  const onBeforeCompile = (shader: THREE.Shader) => {
    shader.uniforms.u_time = uniforms.u_time;
    shader.uniforms.u_intensity = uniforms.u_intensity;
    shader.vertexShader = `
      varying vec2 vUv;
      uniform float u_time;
      ${shader.vertexShader}
    `.replace(
      `#include <begin_vertex>`,
      `#include <begin_vertex>
        vUv = uv;
        vNormal = normal;
        float angle = u_time * 0.1;
        mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        transformed.xz = rot * transformed.xz;
      `
    );
    shader.fragmentShader = `
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_intensity;
      
      // Perlin noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.wz + h.yz * x12.xw;
        return 130.0 * dot(m, g);
      }
      
      ${shader.fragmentShader}
    `.replace(
        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        `
        float noise = (snoise(vUv * 5.0 + u_time * 0.2) + 1.0) * 0.5;
        vec3 color = diffuse;
        color = mix(color, vec3(0.2, 0.3, 0.8), noise * u_intensity);
        
        float fresnel = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
        fresnel = pow(fresnel, 2.0);
        color = mix(color, vec3(0.8, 0.9, 1.0), fresnel);

        vec4 diffuseColor = vec4( color, opacity );`
    );
    materialRef.current.userData.uniforms = shader.uniforms;
  };

  return (
    <Sphere ref={ref} args={[2, 32, 32]}>
      <meshStandardMaterial
        ref={materialRef}
        color="#151520"
        roughness={0.4}
        metalness={0.1}
        onBeforeCompile={onBeforeCompile}
      />
    </Sphere>
  );
}

export function GenesisOrb() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Orb />
      <Sparkles count={100} scale={5} size={2} speed={0.4} color="#87CEEB" />
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} intensity={0.6} levels={8} mipmapBlur />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}
