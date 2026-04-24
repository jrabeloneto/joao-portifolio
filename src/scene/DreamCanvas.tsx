import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { scrollState, CH, range, envelope } from '../state/scroll';
import { projects } from '../data/projects';

/* ------------------------------------------------------------------ */
/* Volumetric fog / sky sphere — morphs color + density with progress */
/* ------------------------------------------------------------------ */

const skyVert = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFrag = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColorTop;
  uniform vec3 uColorMid;
  uniform vec3 uColorLow;
  varying vec3 vPos;

  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    f = f*f*(3.0-2.0*f);
    float a = mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y);
    float b = mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y);
    return mix(a, b, f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main() {
    vec3 dir = normalize(vPos);
    float y = dir.y;
    // base gradient: sunset → dusk → night as progress rises
    vec3 top = mix(uColorTop, vec3(0.02, 0.03, 0.08), smoothstep(0.0, 1.0, uProgress));
    vec3 mid = mix(uColorMid, vec3(0.08, 0.06, 0.22), smoothstep(0.1, 0.9, uProgress));
    vec3 low = mix(uColorLow, vec3(0.12, 0.10, 0.28), smoothstep(0.2, 1.0, uProgress));
    vec3 col;
    if (y > 0.2) col = mix(mid, top, smoothstep(0.2, 0.9, y));
    else         col = mix(low, mid, smoothstep(-0.3, 0.2, y));
    // volumetric cloud haze
    float cloud = fbm(dir * 2.5 + vec3(uTime * 0.02, 0.0, uTime * 0.015));
    cloud = smoothstep(0.35, 0.85, cloud);
    col = mix(col, vec3(0.72, 0.68, 0.85), cloud * 0.25 * (1.0 - uProgress * 0.6));
    gl_FragColor = vec4(col, 1.0);
  }
`;

function SkyDome() {
  const ref = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColorTop: { value: new THREE.Color('#4a5a88') },
    uColorMid: { value: new THREE.Color('#a99abd') },
    uColorLow: { value: new THREE.Color('#d6b5b0') },
  }), []);

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
    uniforms.uProgress.value += (scrollState.progress - uniforms.uProgress.value) * Math.min(dt * 4, 1);
  });

  return (
    <mesh ref={ref} scale={[-1, 1, 1]}>
      <sphereGeometry args={[400, 32, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={skyVert}
        fragmentShader={skyFrag}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Drifting cloud billboards — always visible, fade with progress     */
/* ------------------------------------------------------------------ */

const cloudFrag = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform vec3 uTint;
  uniform float uOpacity;
  varying vec2 vUv;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}
  void main(){
    vec2 uv = vUv;
    uv.x += uTime * uSpeed * 0.02;
    float n = fbm(uv * 3.2);
    float shape = smoothstep(0.42, 0.78, n);
    float edge = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x) *
                 smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.65, vUv.y);
    gl_FragColor = vec4(uTint, shape * edge * uOpacity);
  }
`;
const cloudVert = /* glsl */ `
  varying vec2 vUv;
  void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}
`;

function Cloud({ pos, scale, speed, tint, opacity }: {
  pos: [number, number, number]; scale: number; speed: number; tint: string; opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(() => ({
    uTime: { value: Math.random() * 10 },
    uSpeed: { value: speed },
    uTint: { value: new THREE.Color(tint) },
    uOpacity: { value: opacity },
  }), [speed, tint, opacity]);
  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
    if (ref.current) ref.current.lookAt(0, 0, 0);
  });
  return (
    <mesh ref={ref} position={pos} scale={[scale * 2.2, scale, 1]}>
      <planeGeometry />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={cloudVert}
        fragmentShader={cloudFrag}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function CloudField() {
  const clouds = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; speed: number; tint: string; opacity: number }[] = [];
    for (let i = 0; i < 30; i++) {
      const z = -10 - i * 12 + Math.random() * 10;
      const x = (Math.random() - 0.5) * 80;
      const y = 2 + Math.random() * 8;
      const scale = 8 + Math.random() * 10;
      const speed = 0.2 + Math.random() * 0.8;
      const tints = ['#F5EEDC', '#E8BCC8', '#BFB5D9', '#C4DFF5'];
      const tint = tints[i % tints.length];
      arr.push({ pos: [x, y, z], scale, speed, tint, opacity: 0.4 + Math.random() * 0.3 });
    }
    return arr;
  }, []);
  return <>{clouds.map((c, i) => <Cloud key={i} {...c} />)}</>;
}

/* ------------------------------------------------------------------ */
/* Hero Sun (visible chapter 0)                                       */
/* ------------------------------------------------------------------ */

function Sun() {
  const ref = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame(() => {
    const op = envelope(scrollState.progress, CH.hero[0], CH.hero[1], 0.08);
    if (matRef.current) matRef.current.opacity = 0.95 * op;
    if (ref.current) {
      ref.current.rotation.z += 0.001;
      ref.current.position.y = -0.8 + Math.sin(performance.now() * 0.0004) * 0.1;
    }
  });
  return (
    <group ref={ref} position={[0, -0.8, -25]}>
      <mesh>
        <circleGeometry args={[4.2, 64]} />
        <meshBasicMaterial ref={matRef} color="#FFE5A8" transparent opacity={0.95} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <circleGeometry args={[7.5, 64]} />
        <meshBasicMaterial color="#FFD08A" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0, -0.2]}>
        <circleGeometry args={[12, 64]} />
        <meshBasicMaterial color="#E8BCC8" transparent opacity={0.22} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* About Chapter — floating monolith emerging from fog                */
/* ------------------------------------------------------------------ */

function Monolith() {
  const ref = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame(() => {
    const op = envelope(scrollState.progress, CH.about[0], CH.about[1], 0.08);
    if (matRef.current) matRef.current.opacity = op;
    if (ref.current) {
      ref.current.rotation.y += 0.003;
      ref.current.position.y = Math.sin(performance.now() * 0.0005) * 0.4;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, -40]}>
      <boxGeometry args={[2, 6, 0.4]} />
      <meshStandardMaterial
        ref={matRef}
        color="#d8c8e8"
        emissive="#8b7aa8"
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.8}
        transparent
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Projects Chapter — 8 screens floating in an arc through deep space */
/* ------------------------------------------------------------------ */

function ProjectScreen({ index, total, url }: { index: number; total: number; url: string }) {
  const tex = useTexture(url);
  const ref = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const frameMat = useRef<THREE.MeshStandardMaterial>(null!);

  // Arrange along a gentle spiral path inside the projects range
  const { basePos, rotY } = useMemo(() => {
    const t = index / (total - 1); // 0..1
    const x = Math.sin(t * Math.PI * 1.4) * 12;
    const y = Math.cos(t * Math.PI * 1.8) * 3 + 0.5;
    const z = -60 - t * 80; // -60 .. -140
    return { basePos: new THREE.Vector3(x, y, z), rotY: -x * 0.05 };
  }, [index, total]);

  useFrame(() => {
    const p = scrollState.progress;
    const local = range(p, CH.projects[0], CH.projects[1]);
    // slot window: each project glows when local ~ index/(total-1)
    const slot = index / Math.max(1, total - 1);
    const focus = Math.max(0, 1 - Math.abs(local - slot) * total * 1.2);
    if (matRef.current) matRef.current.opacity = 0.4 + 0.6 * Math.max(0.2, focus);
    if (frameMat.current) frameMat.current.emissiveIntensity = 0.2 + focus * 1.5;
    if (ref.current) {
      ref.current.position.x = basePos.x + Math.sin(performance.now() * 0.0004 + index) * 0.15;
      ref.current.position.y = basePos.y + Math.cos(performance.now() * 0.0005 + index) * 0.2;
      ref.current.rotation.y = rotY + Math.sin(performance.now() * 0.0003 + index) * 0.05;
      ref.current.scale.setScalar(1 + focus * 0.25);
    }
  });

  return (
    <group ref={ref} position={basePos.toArray()} rotation={[0, rotY, 0]}>
      {/* glowing frame */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[5.6, 3.4]} />
        <meshStandardMaterial
          ref={frameMat}
          color="#d8c8e8"
          emissive="#b5a2d2"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* screen */}
      <mesh>
        <planeGeometry args={[5.2, 3]} />
        <meshBasicMaterial ref={matRef} map={tex} transparent toneMapped={false} />
      </mesh>
      {/* halo */}
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial color="#8b7aa8" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ProjectsGallery() {
  const group = useRef<THREE.Group>(null!);
  useFrame(() => {
    const op = envelope(scrollState.progress, CH.projects[0], CH.projects[1], 0.04);
    if (group.current) group.current.visible = op > 0.01;
  });
  return (
    <group ref={group}>
      {projects.map((p, i) => (
        <ProjectScreen key={p.slug} index={i} total={projects.length} url={p.image} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Skills Chapter — orbital constellation of glowing dots             */
/* ------------------------------------------------------------------ */

function SkillsConstellation() {
  const ref = useRef<THREE.Group>(null!);
  const points = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 60; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / 60);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 8;
      arr.push([
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      ]);
    }
    return arr;
  }, []);
  useFrame((_, dt) => {
    const op = envelope(scrollState.progress, CH.skills[0], CH.skills[1], 0.06);
    if (ref.current) {
      ref.current.visible = op > 0.01;
      ref.current.rotation.y += dt * 0.15;
      ref.current.rotation.x += dt * 0.05;
      ref.current.children.forEach((child) => {
        const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (m) m.opacity = op;
      });
    }
  });
  return (
    <group ref={ref} position={[0, 0, -160]}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#FFE5A8' : i % 3 === 1 ? '#BFB5D9' : '#C4DFF5'} transparent toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Experience Chapter — luminous timeline trail                       */
/* ------------------------------------------------------------------ */

function TimelineTrail() {
  const ref = useRef<THREE.Group>(null!);
  const dots = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 40; i++) {
      arr.push([
        Math.sin(i * 0.4) * 2,
        -4 + i * 0.3,
        -200 - i * 0.8,
      ]);
    }
    return arr;
  }, []);
  useFrame(() => {
    const op = envelope(scrollState.progress, CH.experience[0], CH.experience[1], 0.06);
    if (ref.current) {
      ref.current.visible = op > 0.01;
      ref.current.children.forEach((child, idx) => {
        const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (m) m.opacity = op * (0.4 + Math.sin(performance.now() * 0.003 + idx * 0.3) * 0.3);
      });
    }
  });
  return (
    <group ref={ref}>
      {dots.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#FFE5A8" transparent toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Contact Chapter — star field emerging in the void                  */
/* ------------------------------------------------------------------ */

function Stars() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const N = 400;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 2] = -240 - Math.random() * 40;
    }
    return arr;
  }, []);
  const matRef = useRef<THREE.PointsMaterial>(null!);
  useFrame(() => {
    const op = envelope(scrollState.progress, CH.contact[0], CH.contact[1], 0.04);
    if (matRef.current) matRef.current.opacity = op;
    if (ref.current) ref.current.rotation.z += 0.0003;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={matRef} size={0.15} color="#fff6dd" transparent sizeAttenuation depthWrite={false} toneMapped={false} />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Camera Rig — dolly forward driven by scroll, mouse parallax        */
/* ------------------------------------------------------------------ */

function CameraRig() {
  const { camera } = useThree();
  const current = useRef({ z: 5, x: 0, y: 0.3, rotY: 0 });
  useFrame((_, dt) => {
    const p = scrollState.progress;
    // Target z moves from +5 to -260 across progress
    const targetZ = 5 - p * 265;
    const targetX = scrollState.mouseX * 0.5;
    const targetY = 0.3 + scrollState.mouseY * 0.3;
    // subtle roll through chapters
    const targetRotY = Math.sin(p * Math.PI * 2) * 0.08 + scrollState.mouseX * 0.05;

    const k = Math.min(dt * 3, 1);
    current.current.z += (targetZ - current.current.z) * k;
    current.current.x += (targetX - current.current.x) * k;
    current.current.y += (targetY - current.current.y) * k;
    current.current.rotY += (targetRotY - current.current.rotY) * k;

    camera.position.set(current.current.x, current.current.y, current.current.z);
    // Always look slightly forward
    const lookZ = current.current.z - 10;
    camera.lookAt(current.current.x * 0.3, current.current.y * 0.3, lookZ);
    camera.rotation.z = current.current.rotY * 0.3;
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Ambient dust particles — constant motion                           */
/* ------------------------------------------------------------------ */

function Dust() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const N = 300;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = -Math.random() * 260;
    }
    return arr;
  }, []);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      const y = attr.getY(i);
      attr.setY(i, y + dt * 0.15 + Math.sin(state.clock.elapsedTime + i) * 0.003);
      if (attr.getY(i) > 12) attr.setY(i, -12);
    }
    attr.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#FFE5A8" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Main export                                                         */
/* ------------------------------------------------------------------ */

export function DreamCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 5], fov: 55, near: 0.1, far: 800 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <SkyDome />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, -5]} intensity={1.2} color="#ffd8a8" />
      <directionalLight position={[-5, -2, -30]} intensity={0.6} color="#bfb5d9" />
      <CloudField />
      <Sun />
      <Monolith />
      <ProjectsGallery />
      <SkillsConstellation />
      <TimelineTrail />
      <Stars />
      <Dust />
      <CameraRig />
      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.35} luminanceSmoothing={0.4} mipmapBlur />
        <ChromaticAberration offset={[0.0008, 0.0012]} blendFunction={BlendFunction.NORMAL} radialModulation={false} modulationOffset={0} />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
