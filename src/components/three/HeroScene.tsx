import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Hero scene: Endless dream field at dusk.
 * - Ground plane stretching to horizon
 * - Animated gradient sky dome
 * - Soft sun disc above horizon with halo
 * - Volumetric cloud planes in 3 depths, drifting
 * - Dust particles
 * - Camera tilts subtly toward mouse
 */

function Sky() {
  const ref = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorTop: { value: new THREE.Color('#C4DFF5') },
      uColorMid: { value: new THREE.Color('#E8BCC8') },
      uColorLow: { value: new THREE.Color('#F5D9B8') },
    }),
    []
  );

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
  });

  return (
    <mesh ref={ref} position={[0, 0, -50]} scale={[180, 90, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColorTop;
          uniform vec3 uColorMid;
          uniform vec3 uColorLow;
          varying vec2 vUv;

          // subtle breathing
          void main() {
            float breath = 0.5 + 0.5 * sin(uTime * 0.1);
            float y = vUv.y;
            vec3 top = mix(uColorTop, uColorMid, 0.3 + 0.15 * breath);
            vec3 color;
            if (y > 0.55) {
              color = mix(uColorMid, top, smoothstep(0.55, 1.0, y));
            } else if (y > 0.25) {
              color = mix(uColorLow, uColorMid, smoothstep(0.25, 0.55, y));
            } else {
              color = uColorLow;
            }
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.02;
  });
  return (
    <group position={[0, -1.2, -20]}>
      {/* core */}
      <mesh ref={ref}>
        <circleGeometry args={[3.2, 64]} />
        <meshBasicMaterial color="#FFE5A8" transparent opacity={0.95} />
      </mesh>
      {/* halo */}
      <mesh position={[0, 0, -0.1]}>
        <circleGeometry args={[5.5, 64]} />
        <meshBasicMaterial color="#FFD08A" transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0, -0.2]}>
        <circleGeometry args={[9, 64]} />
        <meshBasicMaterial color="#E8BCC8" transparent opacity={0.18} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function CloudLayer({
  z, y, scale, speed, opacity, tint,
}: { z: number; y: number; scale: number; speed: number; opacity: number; tint: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 10 },
      uSpeed: { value: speed },
      uOpacity: { value: opacity },
      uTint: { value: new THREE.Color(tint) },
    }),
    [speed, opacity, tint]
  );

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
  });

  return (
    <mesh ref={ref} position={[0, y, z]} scale={[scale * 2.2, scale, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uSpeed;
          uniform float uOpacity;
          uniform vec3 uTint;
          varying vec2 vUv;

          // 2D hash
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i), hash(i + vec2(1,0)), f.x),
              mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
              f.y
            );
          }
          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 5; i++) {
              v += a * noise(p);
              p *= 2.0;
              a *= 0.5;
            }
            return v;
          }

          void main() {
            vec2 uv = vUv;
            uv.x += uTime * uSpeed * 0.02;
            float n = fbm(uv * 3.2);
            // mask sky-shaped clouds (softer bottom)
            float shape = smoothstep(0.4, 0.75, n);
            // fade edges
            float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);
            edge *= smoothstep(0.05, 0.4, vUv.y) * smoothstep(1.0, 0.65, vUv.y);
            float alpha = shape * edge * uOpacity;
            gl_FragColor = vec4(uTint, alpha);
          }
        `}
      />
    </mesh>
  );
}

function Ground() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCream: { value: new THREE.Color('#EEE4D1') },
      uMist: { value: new THREE.Color('#BFB5D9') },
      uHorizon: { value: new THREE.Color('#F5D9B8') },
    }),
    []
  );
  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, -10]}>
      <planeGeometry args={[200, 120, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uCream;
          uniform vec3 uMist;
          uniform vec3 uHorizon;
          varying vec2 vUv;

          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p);
            f = f*f*(3.0-2.0*f);
            return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
                       mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
          }

          void main() {
            // grass-like stippling
            float grass = noise(vUv * 180.0);
            float grass2 = noise(vUv * 40.0);
            vec3 base = mix(uCream, uMist * 0.9, smoothstep(0.2, 0.9, vUv.y));
            base = mix(base, uHorizon, smoothstep(0.85, 1.0, vUv.y));
            base += (grass - 0.5) * 0.06;
            base += (grass2 - 0.5) * 0.04;
            // distance fog
            float d = 1.0 - vUv.y;
            base = mix(base, uHorizon * 1.05, smoothstep(0.0, 0.35, d));
            gl_FragColor = vec4(base, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const N = 180;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = Math.random() * 8 - 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    return arr;
  }, []);

  useFrame((state, dt) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      const y = attr.getY(i);
      attr.setY(i, y + dt * 0.15 + Math.sin(state.clock.elapsedTime + i) * 0.005);
      if (attr.getY(i) > 6) attr.setY(i, -2);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#FFE5A8" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, dt) => {
    const m = state.pointer; // normalized -1..1
    target.current.x += (m.x * 0.4 - target.current.x) * Math.min(dt * 4, 1);
    target.current.y += (m.y * 0.25 - target.current.y) * Math.min(dt * 4, 1);
    camera.position.x = target.current.x;
    camera.position.y = target.current.y + 0.3;
    camera.lookAt(0, 0, -10);
  });
  return null;
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 5], fov: 55 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#C4DFF5']} />
      <Sky />
      {/* far clouds, slowest */}
      <CloudLayer z={-18} y={3.2} scale={18} speed={0.25} opacity={0.55} tint="#F5EEDC" />
      <CloudLayer z={-14} y={4.1} scale={14} speed={0.4} opacity={0.7} tint="#E8BCC8" />
      <Sun />
      {/* closer clouds, faster */}
      <CloudLayer z={-8} y={2.5} scale={10} speed={0.7} opacity={0.5} tint="#BFB5D9" />
      <CloudLayer z={-4} y={-1} scale={6} speed={1.1} opacity={0.35} tint="#C4DFF5" />
      <Ground />
      <Dust />
      <CameraRig />
    </Canvas>
  );
}
