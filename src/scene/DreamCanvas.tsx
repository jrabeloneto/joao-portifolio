import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { scrollState, CH, range, envelope, cameraZAt, notify } from '../state/scroll';
import { projects } from '../data/projects';
import { SKILLS } from '../data/skills';

/* ==================================================================
   SKY DOME — palette morphs across 9 chapter palettes
   ================================================================== */

type Palette = { top: string; mid: string; low: string; haze: number };
const PALETTES: Palette[] = [
  { top: '#4a5a88', mid: '#b89abd', low: '#f2d0b0', haze: 0.30 }, // hero   — dusk
  { top: '#6d7fa8', mid: '#c7b8d8', low: '#ead8c0', haze: 0.35 }, // about  — airy clouds
  { top: '#3d4870', mid: '#8a7aa8', low: '#b89abd', haze: 0.28 }, // approach — violet dream
  { top: '#0a0f28', mid: '#1a1f48', low: '#35305a', haze: 0.15 }, // skills — deep space
  { top: '#281438', mid: '#5a2848', low: '#a8507a', haze: 0.22 }, // projects — violet sunset
  { top: '#150c28', mid: '#2d1a48', low: '#4a2858', haze: 0.18 }, // experience — night
  { top: '#0a0a14', mid: '#181820', low: '#2a2832', haze: 0.08 }, // storm — black grey
  { top: '#5ea8d8', mid: '#a8d8ea', low: '#c8e8b8', haze: 0.45 }, // field — blue sky / green
  { top: '#2a1a12', mid: '#4a3020', low: '#8a5a32', haze: 0.10 }, // house interior — warm wood
];

function lerpColor(a: THREE.Color, b: THREE.Color, t: number, out: THREE.Color) {
  out.r = a.r + (b.r - a.r) * t;
  out.g = a.g + (b.g - a.g) * t;
  out.b = a.b + (b.b - a.b) * t;
  return out;
}

const skyVert = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFrag = /* glsl */ `
  uniform float uTime;
  uniform float uHaze;
  uniform float uFlash;
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
  float fbm(vec3 p) { float v=0.0; float a=0.5; for (int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5; } return v; }

  void main() {
    vec3 dir = normalize(vPos);
    float y = dir.y;
    vec3 col;
    if (y > 0.2) col = mix(uColorMid, uColorTop, smoothstep(0.2, 0.9, y));
    else         col = mix(uColorLow, uColorMid, smoothstep(-0.3, 0.2, y));
    // volumetric cloud haze
    float cloud = fbm(dir * 2.8 + vec3(uTime * 0.02, 0.0, uTime * 0.015));
    cloud = smoothstep(0.35, 0.85, cloud);
    col = mix(col, col * 1.6 + vec3(0.05), cloud * uHaze);
    // lightning flash — additive whiten
    col += vec3(0.9, 0.92, 1.0) * uFlash;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function SkyDome() {
  const ref = useRef<THREE.Mesh>(null!);
  const tmp = useMemo(() => ({
    top: new THREE.Color(), mid: new THREE.Color(), low: new THREE.Color(),
    topA: new THREE.Color(), topB: new THREE.Color(),
    midA: new THREE.Color(), midB: new THREE.Color(),
    lowA: new THREE.Color(), lowB: new THREE.Color(),
  }), []);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHaze: { value: 0.3 },
    uFlash: { value: 0 },
    uColorTop: { value: new THREE.Color(PALETTES[0].top) },
    uColorMid: { value: new THREE.Color(PALETTES[0].mid) },
    uColorLow: { value: new THREE.Color(PALETTES[0].low) },
  }), []);

  // storm flash state
  const flashNext = useRef(0);
  const flashIntensity = useRef(0);

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
    const p = scrollState.progress;

    // Which palette segment?
    const segs = PALETTES.length - 1;
    const t = Math.max(0, Math.min(1, p)) * segs;
    const i = Math.floor(t);
    const f = t - i;
    const a = PALETTES[Math.min(i, segs)];
    const b = PALETTES[Math.min(i + 1, segs)];
    tmp.topA.set(a.top); tmp.topB.set(b.top);
    tmp.midA.set(a.mid); tmp.midB.set(b.mid);
    tmp.lowA.set(a.low); tmp.lowB.set(b.low);
    lerpColor(tmp.topA, tmp.topB, f, tmp.top);
    lerpColor(tmp.midA, tmp.midB, f, tmp.mid);
    lerpColor(tmp.lowA, tmp.lowB, f, tmp.low);
    uniforms.uColorTop.value.copy(tmp.top);
    uniforms.uColorMid.value.copy(tmp.mid);
    uniforms.uColorLow.value.copy(tmp.low);
    uniforms.uHaze.value = a.haze + (b.haze - a.haze) * f;

    // Lightning — only during storm
    const stormOp = envelope(p, CH.storm[0], CH.storm[1], 0.03);
    if (stormOp > 0.1) {
      const now = performance.now() / 1000;
      if (now > flashNext.current) {
        flashIntensity.current = 0.7 + Math.random() * 0.5;
        flashNext.current = now + 0.8 + Math.random() * 2.4;
      }
      flashIntensity.current = Math.max(0, flashIntensity.current - dt * 4.5);
      uniforms.uFlash.value = flashIntensity.current * stormOp;
    } else {
      uniforms.uFlash.value = 0;
    }
  });

  return (
    <mesh ref={ref} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 32, 32]} />
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

/* Cloud billboard — unchanged */
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
      <shaderMaterial uniforms={uniforms} vertexShader={cloudVert} fragmentShader={cloudFrag} transparent depthWrite={false} />
    </mesh>
  );
}

function CloudField() {
  const clouds = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; speed: number; tint: string; opacity: number }[] = [];
    for (let i = 0; i < 40; i++) {
      const z = -10 - i * 14 + Math.random() * 10;
      const x = (Math.random() - 0.5) * 100;
      const y = 2 + Math.random() * 10;
      const scale = 8 + Math.random() * 12;
      const speed = 0.2 + Math.random() * 0.8;
      const tints = ['#F5EEDC', '#E8BCC8', '#BFB5D9', '#C4DFF5'];
      const tint = tints[i % tints.length];
      arr.push({ pos: [x, y, z], scale, speed, tint, opacity: 0.4 + Math.random() * 0.3 });
    }
    return arr;
  }, []);
  const group = useRef<THREE.Group>(null!);
  useFrame(() => {
    // Clouds fade out during storm/field/house
    const p = scrollState.progress;
    const stormish = envelope(p, 0.74, 1.0, 0.03);
    if (group.current) {
      group.current.children.forEach((c) => {
        const m = (c as THREE.Mesh).material as THREE.ShaderMaterial;
        if (m && m.uniforms.uOpacity) {
          m.uniforms.uOpacity.value = (0.45) * (1 - stormish);
        }
      });
    }
  });
  return <group ref={group}>{clouds.map((c, i) => <Cloud key={i} {...c} />)}</group>;
}

/* ==================================================================
   HERO SUN
   ================================================================== */

function Sun() {
  const ref = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const haloA = useRef<THREE.MeshBasicMaterial>(null!);
  const haloB = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame(() => {
    const op = envelope(scrollState.progress, CH.hero[0], CH.hero[1], 0.04);
    if (matRef.current) matRef.current.opacity = 0.95 * op;
    if (haloA.current) haloA.current.opacity = 0.4 * op;
    if (haloB.current) haloB.current.opacity = 0.22 * op;
    if (ref.current) {
      ref.current.rotation.z += 0.001;
      ref.current.position.y = -0.8 + Math.sin(performance.now() * 0.0004) * 0.1;
    }
  });
  return (
    <group ref={ref} position={[0, -0.8, -25]}>
      <mesh><circleGeometry args={[4.2, 64]} /><meshBasicMaterial ref={matRef} color="#FFE5A8" transparent toneMapped={false} /></mesh>
      <mesh position={[0, 0, -0.1]}><circleGeometry args={[7.5, 64]} /><meshBasicMaterial ref={haloA} color="#FFD08A" transparent blending={THREE.AdditiveBlending} /></mesh>
      <mesh position={[0, 0, -0.2]}><circleGeometry args={[12, 64]} /><meshBasicMaterial ref={haloB} color="#E8BCC8" transparent blending={THREE.AdditiveBlending} /></mesh>
    </group>
  );
}

/* ==================================================================
   ABOUT — floating crystal shards (ambient)
   ================================================================== */

function CrystalShards() {
  const group = useRef<THREE.Group>(null!);
  const shards = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => ({
      pos: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 6,
        -60 - i * 3,
      ] as [number, number, number],
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: 0.6 + Math.random() * 0.8,
    }));
  }, []);
  useFrame((_, dt) => {
    const op = envelope(scrollState.progress, CH.about[0], CH.approach[1], 0.05);
    if (group.current) {
      group.current.visible = op > 0.01;
      group.current.rotation.y += dt * 0.08;
      group.current.children.forEach((c, i) => {
        c.rotation.x += dt * (0.1 + i * 0.02);
        c.rotation.z += dt * 0.05;
        const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (m) m.opacity = op;
      });
    }
  });
  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#d8c8e8"
            emissive="#8b7aa8"
            emissiveIntensity={0.5}
            roughness={0.15}
            metalness={0.9}
            transparent
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

/* ==================================================================
   SKILLS — interactive constellation with hover
   ================================================================== */

function SkillPoint({ index, position, label, active }: {
  index: number; position: [number, number, number]; label: string; active: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame(() => {
    const op = envelope(scrollState.progress, CH.skills[0], CH.skills[1], 0.04);
    if (matRef.current) matRef.current.opacity = op;
    if (meshRef.current) {
      const hovered = scrollState.hoveredSkill === index;
      const target = hovered ? 3.0 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.18);
    }
    void label; void active;
  });
  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        scrollState.hoveredSkill = index;
        scrollState.skillHoverX = (e as unknown as PointerEvent).clientX;
        scrollState.skillHoverY = (e as unknown as PointerEvent).clientY;
        notify();
      }}
      onPointerMove={(e) => {
        scrollState.skillHoverX = (e as unknown as PointerEvent).clientX;
        scrollState.skillHoverY = (e as unknown as PointerEvent).clientY;
        notify();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (scrollState.hoveredSkill === index) {
          scrollState.hoveredSkill = -1;
          notify();
        }
      }}
    >
      <sphereGeometry args={[0.18, 10, 10]} />
      <meshBasicMaterial ref={matRef} color={index % 3 === 0 ? '#FFE5A8' : index % 3 === 1 ? '#BFB5D9' : '#C4DFF5'} transparent toneMapped={false} />
    </mesh>
  );
}

function SkillsConstellation() {
  const ref = useRef<THREE.Group>(null!);
  const points = useMemo(() => {
    return SKILLS.map((_, i) => {
      const phi = Math.acos(1 - 2 * (i + 0.5) / SKILLS.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 8;
      return [
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      ] as [number, number, number];
    });
  }, []);
  useFrame((_, dt) => {
    const op = envelope(scrollState.progress, CH.skills[0], CH.skills[1], 0.04);
    if (ref.current) {
      ref.current.visible = op > 0.01;
      ref.current.rotation.y += dt * 0.12;
      ref.current.rotation.x += dt * 0.04;
    }
  });
  return (
    <group ref={ref} position={[0, 0, -130]}>
      {points.map((p, i) => (
        <SkillPoint key={i} index={i} position={p} label={SKILLS[i].name} active />
      ))}
    </group>
  );
}

/* ==================================================================
   PROJECTS — 8 floating screens, wider spiral
   ================================================================== */

function ProjectScreen({ index, total, url }: { index: number; total: number; url: string }) {
  const tex = useTexture(url);
  const ref = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const frameMat = useRef<THREE.MeshStandardMaterial>(null!);
  const { basePos, rotY } = useMemo(() => {
    const t = index / (total - 1);
    const x = Math.sin(t * Math.PI * 2.0) * 14;
    const y = Math.cos(t * Math.PI * 2.2) * 3.5 + 0.5;
    // Spread projects across z=-200 .. z=-350 (long range)
    const z = -200 - t * 150;
    return { basePos: new THREE.Vector3(x, y, z), rotY: -x * 0.04 };
  }, [index, total]);

  useFrame(() => {
    const p = scrollState.progress;
    const local = range(p, CH.projects[0], CH.projects[1]);
    const slot = index / Math.max(1, total - 1);
    const focus = Math.max(0, 1 - Math.abs(local - slot) * total * 0.85);
    const op = envelope(p, CH.projects[0], CH.projects[1], 0.03);
    if (matRef.current) matRef.current.opacity = op * (0.35 + 0.65 * Math.max(0.25, focus));
    if (frameMat.current) frameMat.current.emissiveIntensity = 0.2 + focus * 1.8;
    if (ref.current) {
      ref.current.position.x = basePos.x + Math.sin(performance.now() * 0.0004 + index) * 0.2;
      ref.current.position.y = basePos.y + Math.cos(performance.now() * 0.0005 + index) * 0.25;
      ref.current.rotation.y = rotY + Math.sin(performance.now() * 0.0003 + index) * 0.08;
      ref.current.scale.setScalar(1 + focus * 0.35);
    }
  });

  return (
    <group ref={ref} position={basePos.toArray()} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[5.6, 3.4]} />
        <meshStandardMaterial ref={frameMat} color="#d8c8e8" emissive="#b5a2d2" emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh>
        <planeGeometry args={[5.2, 3]} />
        <meshBasicMaterial ref={matRef} map={tex} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial color="#a88bd8" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
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

/* ==================================================================
   EXPERIENCE — luminous timeline trail
   ================================================================== */

function TimelineTrail() {
  const ref = useRef<THREE.Group>(null!);
  const dots = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 50; i++) {
      arr.push([Math.sin(i * 0.4) * 2.5, -3 + i * 0.25, -380 - i * 0.9]);
    }
    return arr;
  }, []);
  useFrame(() => {
    const op = envelope(scrollState.progress, CH.experience[0], CH.experience[1], 0.05);
    if (ref.current) {
      ref.current.visible = op > 0.01;
      ref.current.children.forEach((child, idx) => {
        const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (m) m.opacity = op * (0.35 + Math.sin(performance.now() * 0.003 + idx * 0.3) * 0.35);
      });
    }
  });
  return (
    <group ref={ref}>
      {dots.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color="#FFE5A8" transparent toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ==================================================================
   STORM — dark cloud layer, lightning bolts, weirdcore eyes on flash
   ================================================================== */

function StormClouds() {
  const group = useRef<THREE.Group>(null!);
  const clouds = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; speed: number }[] = [];
    for (let i = 0; i < 25; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 80, -2 + Math.random() * 10, -440 - i * 4],
        scale: 10 + Math.random() * 14,
        speed: 0.3 + Math.random() * 0.8,
      });
    }
    return arr;
  }, []);
  useFrame(() => {
    const op = envelope(scrollState.progress, CH.storm[0], CH.storm[1], 0.03);
    if (group.current) {
      group.current.visible = op > 0.01;
      group.current.children.forEach((c) => {
        const m = (c as THREE.Mesh).material as THREE.ShaderMaterial;
        if (m && m.uniforms.uOpacity) m.uniforms.uOpacity.value = op * 0.9;
      });
    }
  });
  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <Cloud key={i} pos={c.pos} scale={c.scale} speed={c.speed} tint="#1a1a22" opacity={0.85} />
      ))}
    </group>
  );
}

/** Weirdcore eyes that flash into view when lightning strikes */
function StormEyes() {
  const group = useRef<THREE.Group>(null!);
  const eyes = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 12; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 60, -3 + Math.random() * 10, -445 - Math.random() * 30],
        scale: 0.8 + Math.random() * 1.4,
      });
    }
    return arr;
  }, []);
  const flashIntensity = useRef(0);
  const flashNext = useRef(0);
  useFrame((_, dt) => {
    const p = scrollState.progress;
    const stormOp = envelope(p, CH.storm[0], CH.storm[1], 0.03);
    if (group.current) {
      group.current.visible = stormOp > 0.05;
      if (stormOp > 0.05) {
        const now = performance.now() / 1000;
        if (now > flashNext.current) {
          flashIntensity.current = 1;
          flashNext.current = now + 0.9 + Math.random() * 2.2;
        }
        flashIntensity.current = Math.max(0, flashIntensity.current - dt * 3.5);
        group.current.children.forEach((c, i) => {
          const iris = c.children[1] as THREE.Mesh | undefined;
          const sclera = c.children[0] as THREE.Mesh | undefined;
          const pupil = c.children[2] as THREE.Mesh | undefined;
          const vis = flashIntensity.current * (0.4 + 0.6 * Math.sin(i * 1.3 + now * 2));
          [iris, sclera, pupil].forEach((m) => {
            if (!m) return;
            const mat = m.material as THREE.MeshBasicMaterial;
            if (mat) mat.opacity = Math.max(0, vis) * stormOp;
          });
        });
      }
    }
  });
  return (
    <group ref={group}>
      {eyes.map((e, i) => (
        <group key={i} position={e.pos} scale={e.scale} rotation={[0, 0, (Math.random() - 0.5) * 0.4]}>
          <mesh>
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial color="#e8e8e0" transparent opacity={0} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <circleGeometry args={[0.55, 32]} />
            <meshBasicMaterial color="#1a1a22" transparent opacity={0} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <circleGeometry args={[0.22, 32]} />
            <meshBasicMaterial color="#000" transparent opacity={0} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ==================================================================
   STORM MOON — interactive: glow reacts to cursor proximity
   ================================================================== */

const moonFrag = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec2 uMouse;       // world-space projected mouse (in plane uv 0..1)
  uniform float uMouseInside;
  varying vec2 vUv;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}
  void main(){
    vec2 c = vUv - 0.5;
    float dist = length(c);
    // moon core (bright disc)
    float core = smoothstep(0.22, 0.19, dist);
    // crater texture
    float craters = fbm(vUv * 14.0 + vec2(0.0, uTime * 0.03));
    vec3 moonColor = mix(vec3(0.86, 0.84, 0.78), vec3(0.62, 0.64, 0.72), craters * 0.4);
    // distance from cursor to this fragment (both in 0..1 uv)
    vec2 mouseOffset = vUv - uMouse;
    float mDist = length(mouseOffset);
    // ripple wave emanating from cursor
    float ripple = 0.0;
    if (uMouseInside > 0.5) {
      ripple = sin(mDist * 28.0 - uTime * 4.0) * exp(-mDist * 4.0) * 0.5;
    }
    // outer halo: falls off from center, distorted by cursor
    float halo = smoothstep(0.5, 0.22, dist);
    halo += ripple * 0.4;
    halo = max(0.0, halo);
    // shadow where cursor is — cursor "blocks" some light
    float shadow = 1.0;
    if (uMouseInside > 0.5) {
      shadow = 1.0 - smoothstep(0.08, 0.0, mDist) * 0.55;
    }
    vec3 haloCol = vec3(0.95, 0.93, 0.82) * halo * shadow;
    vec3 col = moonColor * core + haloCol;
    float alpha = (core + halo * 0.7) * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`;

function StormMoon() {
  const group = useRef<THREE.Group>(null!);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uOpacity: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uMouseInside: { value: 0 },
  }), []);

  useFrame((state, dt) => {
    uniforms.uTime.value += dt;
    const p = scrollState.progress;
    const op = envelope(p, CH.storm[0], CH.storm[1], 0.03);
    uniforms.uOpacity.value = op;
    if (group.current) group.current.visible = op > 0.01;

    // Project mouse (NDC -1..1) into the moon plane UV space (0..1).
    // Moon is big (scale ~8) and positioned ahead of camera; project screen mouse
    // to world at the moon's z, then convert to local uv of the plane.
    const moonWorldZ = -455;
    const moonSize = 8; // plane is 8x8, half-extent 4
    const cam = state.camera as THREE.PerspectiveCamera;
    const vec = new THREE.Vector3(scrollState.mouseX, scrollState.mouseY, 0.5).unproject(cam);
    const dir = vec.sub(cam.position).normalize();
    // distance along ray to reach the moon's z-plane
    const t = (moonWorldZ - cam.position.z) / dir.z;
    const worldHitX = cam.position.x + dir.x * t;
    const worldHitY = cam.position.y + dir.y * t;
    // moon center world (matches group position below)
    const moonX = 0;
    const moonY = 5;
    const localU = (worldHitX - moonX) / moonSize + 0.5;
    const localV = (worldHitY - moonY) / moonSize + 0.5;
    uniforms.uMouse.value.set(localU, localV);
    const inside = localU > -0.2 && localU < 1.2 && localV > -0.2 && localV < 1.2 ? 1 : 0;
    uniforms.uMouseInside.value += (inside - uniforms.uMouseInside.value) * Math.min(dt * 8, 1);
  });

  return (
    <group ref={group} position={[0, 5, -455]}>
      <mesh>
        <planeGeometry args={[8, 8]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={cloudVert}
          fragmentShader={moonFrag}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>
      {/* Additive glow halo — bigger, softer, also reacts via same uniforms */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[16, 16]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={cloudVert}
          fragmentShader={`
            uniform float uOpacity;
            uniform vec2 uMouse;
            uniform float uMouseInside;
            uniform float uTime;
            varying vec2 vUv;
            void main(){
              vec2 c = vUv - 0.5;
              float d = length(c);
              float halo = smoothstep(0.5, 0.08, d);
              // cursor-reactive distortion
              vec2 mo = vUv - uMouse;
              float md = length(mo);
              float push = uMouseInside * exp(-md * 3.0) * (0.5 + 0.5 * sin(uTime * 3.0 - md * 18.0));
              halo *= 1.0 + push * 0.8;
              halo *= 1.0 - uMouseInside * smoothstep(0.15, 0.0, md) * 0.6;
              vec3 col = vec3(0.95, 0.90, 0.75) * halo;
              gl_FragColor = vec4(col, halo * uOpacity * 0.7);
            }
          `}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/** Vertical lightning bolts drawn as thin bright planes */
function LightningBolts() {
  const group = useRef<THREE.Group>(null!);
  const bolts = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      x: (i - 1.5) * 12 + (Math.random() - 0.5) * 6,
      z: -445 - i * 3,
    }));
  }, []);
  const flashIntensity = useRef(0);
  const flashNext = useRef(0);
  const activeBolt = useRef(-1);
  useFrame((_, dt) => {
    const p = scrollState.progress;
    const stormOp = envelope(p, CH.storm[0], CH.storm[1], 0.03);
    if (group.current) {
      group.current.visible = stormOp > 0.05;
      if (stormOp > 0.05) {
        const now = performance.now() / 1000;
        if (now > flashNext.current) {
          flashIntensity.current = 1;
          flashNext.current = now + 0.9 + Math.random() * 2.4;
          activeBolt.current = Math.floor(Math.random() * bolts.length);
        }
        flashIntensity.current = Math.max(0, flashIntensity.current - dt * 6);
        group.current.children.forEach((c, i) => {
          const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
          const vis = i === activeBolt.current ? flashIntensity.current : 0;
          if (m) m.opacity = vis * stormOp;
        });
      }
    }
  });
  return (
    <group ref={group}>
      {bolts.map((b, i) => (
        <mesh key={i} position={[b.x, 3, b.z]}>
          <planeGeometry args={[0.3, 18]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

/* ==================================================================
   FIELD — ground plane with house on hill, bright blue sky
   ================================================================== */

function GrassField() {
  const ref = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uOpacity: { value: 0 },
  }), []);
  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
    const op = envelope(scrollState.progress, CH.field[0], 1.0, 0.04);
    uniforms.uOpacity.value = op;
    if (ref.current) ref.current.visible = op > 0.01;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, -520]}>
      <planeGeometry args={[200, 180, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`
          uniform float uTime;
          uniform float uOpacity;
          varying vec2 vUv;
          float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
          void main(){
            vec2 uv = vUv;
            float n = noise(uv * 200.0 + uTime * 0.1);
            float n2 = noise(uv * 40.0);
            vec3 grass = mix(vec3(0.28, 0.55, 0.22), vec3(0.55, 0.75, 0.28), n2);
            grass += (n - 0.5) * 0.08;
            // horizon fade
            float h = smoothstep(0.4, 0.9, 1.0 - uv.y);
            grass = mix(grass, vec3(0.75, 0.88, 0.95), h * 0.7);
            gl_FragColor = vec4(grass, uOpacity);
          }
        `}
      />
    </mesh>
  );
}

function House() {
  const group = useRef<THREE.Group>(null!);
  useFrame(() => {
    const op = envelope(scrollState.progress, CH.field[0], 1.0, 0.04);
    if (group.current) {
      group.current.visible = op > 0.01;
      group.current.children.forEach((c) => {
        const mesh = c as THREE.Mesh;
        const m = mesh.material as THREE.MeshStandardMaterial;
        if (m) m.opacity = op;
      });
    }
  });
  return (
    // House sits on a hill (raised on y) in front of camera final position (~-560)
    <group ref={group} position={[0, -4.8, -545]} scale={1.5}>
      {/* walls */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[6, 3, 5]} />
        <meshStandardMaterial color="#e6dcc6" roughness={0.85} transparent />
      </mesh>
      {/* roof — pyramid via cone */}
      <mesh position={[0, 3.8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[4.6, 2.3, 4]} />
        <meshStandardMaterial color="#8a3a2a" roughness={0.8} transparent />
      </mesh>
      {/* door */}
      <mesh position={[0, 0.9, 2.51]}>
        <planeGeometry args={[1.2, 1.8]} />
        <meshStandardMaterial color="#3a2418" roughness={0.9} emissive="#ffa858" emissiveIntensity={0.25} transparent />
      </mesh>
      {/* window glowing warm */}
      <mesh position={[-2.1, 1.8, 2.51]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="#ffdba0" emissive="#ffb060" emissiveIntensity={1.2} transparent />
      </mesh>
      <mesh position={[2.1, 1.8, 2.51]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="#ffdba0" emissive="#ffb060" emissiveIntensity={1.2} transparent />
      </mesh>
      {/* chimney */}
      <mesh position={[1.5, 4.6, -0.5]}>
        <boxGeometry args={[0.6, 1.6, 0.6]} />
        <meshStandardMaterial color="#8a6a4a" roughness={0.9} transparent />
      </mesh>
    </group>
  );
}

/** Inside-house computer monitor with contact info glowing */
function ContactMonitor() {
  const ref = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame(() => {
    const op = envelope(scrollState.progress, CH.house[0], CH.house[1], 0.02);
    if (ref.current) {
      ref.current.visible = op > 0.01;
    }
    if (matRef.current) matRef.current.opacity = op;
  });
  return (
    <group ref={ref} position={[0, 0, -565]}>
      {/* dark room backdrop */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[50, 30]} />
        <meshBasicMaterial color="#100a05" transparent opacity={0.9} />
      </mesh>
      {/* monitor bezel */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial color="#0a0a10" transparent toneMapped={false} />
      </mesh>
      {/* screen (the actual content is drawn via overlay HTML synced to same range) */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[7.4, 4.4]} />
        <meshBasicMaterial ref={matRef} color="#1a1f2e" transparent toneMapped={false} />
      </mesh>
      {/* warm room light from side */}
      <pointLight position={[-6, 2, 3]} intensity={3} color="#ffb060" distance={18} />
    </group>
  );
}

/* ==================================================================
   CAMERA RIG — scripted dolly via cameraZAt()
   ================================================================== */

function CameraRig() {
  const { camera } = useThree();
  const current = useRef({ z: 5, x: 0, y: 0.3, rotZ: 0 });
  useFrame((_, dt) => {
    const p = scrollState.progress;
    const targetZ = cameraZAt(p);
    // During field chapter, camera descends (y goes negative to positive — simulating from sky to ground)
    const fieldLocal = range(p, CH.field[0], CH.field[1]);
    const baseY = 0.3 + scrollState.mouseY * 0.25;
    const descentY = baseY + (1 - fieldLocal) * 8 * envelope(p, CH.field[0], CH.field[1], 0.02);
    const targetY = p > CH.field[0] ? descentY : baseY;
    const targetX = scrollState.mouseX * 0.5;
    const targetRotZ = Math.sin(p * Math.PI * 2) * 0.04 + scrollState.mouseX * 0.04;

    const k = Math.min(dt * 2.8, 1);
    current.current.z += (targetZ - current.current.z) * k;
    current.current.x += (targetX - current.current.x) * k;
    current.current.y += (targetY - current.current.y) * k;
    current.current.rotZ += (targetRotZ - current.current.rotZ) * k;

    camera.position.set(current.current.x, current.current.y, current.current.z);
    camera.lookAt(current.current.x * 0.3, current.current.y * 0.3 - fieldLocal * 2, current.current.z - 10);
    camera.rotation.z = current.current.rotZ;
  });
  return null;
}

/* Ambient dust */
function Dust() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const N = 400;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = -Math.random() * 560;
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
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.05} color="#FFE5A8" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* Stars for deep-space chapters */
function Stars() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const N = 600;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 120;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 2] = -60 - Math.random() * 500;
    }
    return arr;
  }, []);
  const matRef = useRef<THREE.PointsMaterial>(null!);
  useFrame(() => {
    const p = scrollState.progress;
    // Visible mostly during skills/projects/experience/storm
    const op = envelope(p, 0.28, 0.84, 0.08);
    if (matRef.current) matRef.current.opacity = op * 0.7;
    if (ref.current) ref.current.rotation.z += 0.0002;
  });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial ref={matRef} size={0.14} color="#fff6dd" transparent sizeAttenuation depthWrite={false} toneMapped={false} />
    </points>
  );
}

/* ==================================================================
   MAIN EXPORT
   ================================================================== */

export function DreamCanvas() {
  const [cursorSkill, setCursorSkill] = useState(false);
  void cursorSkill; void setCursorSkill;
  return (
    <Canvas
      camera={{ position: [0, 0.3, 5], fov: 55, near: 0.1, far: 900 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'auto' }}
    >
      <SkyDome />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, -5]} intensity={1.2} color="#ffd8a8" />
      <directionalLight position={[-5, -2, -30]} intensity={0.6} color="#bfb5d9" />
      <CloudField />
      <Sun />
      <CrystalShards />
      <SkillsConstellation />
      <ProjectsGallery />
      <TimelineTrail />
      <StormClouds />
      <StormMoon />
      <LightningBolts />
      <StormEyes />
      <GrassField />
      <House />
      <ContactMonitor />
      <Dust />
      <Stars />
      <CameraRig />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.4} mipmapBlur />
        <ChromaticAberration offset={[0.0008, 0.0012]} blendFunction={BlendFunction.NORMAL} radialModulation={false} modulationOffset={0} />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
