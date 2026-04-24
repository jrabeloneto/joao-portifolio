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
  const { basePos, rotY, slot } = useMemo(() => {
    // Place each project EXACTLY where the camera will be when its overlay is
    // shown, offset a fixed distance ahead. This keeps the 3D screen locked
    // in sync with the project name in the overlay.
    const s = index / Math.max(1, total - 1);
    const pAtSlot = CH.projects[0] + s * (CH.projects[1] - CH.projects[0]);
    const camZ = cameraZAt(pAtSlot);
    const aheadOffset = 22; // units ahead of camera at this slot
    const z = camZ - aheadOffset;
    // X/Y in a gentle spiral so projects don't stack, but stay roughly in frame
    const x = Math.sin(s * Math.PI * 2.2) * 9;
    const y = Math.cos(s * Math.PI * 2.4) * 2.8 + 0.4;
    return { basePos: new THREE.Vector3(x, y, z), rotY: -x * 0.03, slot: s };
  }, [index, total]);

  useFrame(() => {
    const p = scrollState.progress;
    const local = range(p, CH.projects[0], CH.projects[1]);
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
    const arr: { pos: [number, number, number]; scale: number; speed: number; tint: string }[] = [];
    // Heavy layered storm clouds. Camera sits near z=-450 during storm;
    // clouds are all AHEAD of the camera (z < -450) so the view is a
    // churning wall of thunderheads with the moon (z=-462) framed by them.
    for (let i = 0; i < 80; i++) {
      const layer = i % 4;           // 0 nearest, 3 farthest
      const zBase = -472 - layer * 14;
      arr.push({
        pos: [
          (Math.random() - 0.5) * 130,
          -8 + Math.random() * 22,
          zBase + (Math.random() - 0.5) * 12,
        ],
        scale: 18 + Math.random() * 28,
        speed: 0.2 + Math.random() * 0.6,
        tint: layer === 0 ? '#24242e' : layer === 1 ? '#181820' : layer === 2 ? '#0f0f18' : '#070712',
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
        if (m && m.uniforms.uOpacity) m.uniforms.uOpacity.value = op * 1.0;
      });
    }
  });
  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <Cloud key={i} pos={c.pos} scale={c.scale} speed={c.speed} tint={c.tint} opacity={1.0} />
      ))}
    </group>
  );
}

/** Weirdcore eyes — ALWAYS present during storm, hidden deep in the clouds,
 * their pupils track the cursor. Lightning brightens them briefly. */
function StormEyes() {
  const group = useRef<THREE.Group>(null!);
  const eyes = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; baseOp: number; tilt: number }[] = [];
    // Scatter eyes at multiple depths, embedded amongst storm clouds.
    // All positioned AHEAD of the camera (z < -450) between cloud layers.
    for (let i = 0; i < 18; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 80,
          -5 + Math.random() * 17,
          -468 - Math.random() * 40,
        ],
        scale: 0.7 + Math.random() * 1.4,
        baseOp: 0.28 + Math.random() * 0.40, // always at least faintly visible
        tilt: (Math.random() - 0.5) * 0.4,
      });
    }
    return arr;
  }, []);
  const flashI = useRef(0);
  const flashNext = useRef(0);
  const tmpVec = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    const p = scrollState.progress;
    const stormOp = envelope(p, CH.storm[0], CH.storm[1], 0.03);
    if (!group.current) return;
    group.current.visible = stormOp > 0.01;
    if (stormOp <= 0.01) return;

    // Lightning boost — brief full reveal
    const now = performance.now() / 1000;
    if (now > flashNext.current) {
      flashI.current = 1;
      flashNext.current = now + 1.0 + Math.random() * 2.2;
    }
    flashI.current = Math.max(0, flashI.current - dt * 3.5);

    const cam = state.camera as THREE.PerspectiveCamera;

    group.current.children.forEach((c, i) => {
      const eye = eyes[i];
      const sclera = c.children[0] as THREE.Mesh;
      const iris = c.children[1] as THREE.Mesh;
      const pupil = c.children[2] as THREE.Mesh;

      // Baseline opacity (breathing) + lightning boost
      const breathe = 0.85 + 0.15 * Math.sin(state.clock.elapsedTime * 1.2 + i);
      const baseOp = eye.baseOp * breathe;
      const flashBoost = flashI.current * (1 - eye.baseOp);
      const finalOp = (baseOp + flashBoost) * stormOp;

      [sclera, iris, pupil].forEach((m) => {
        if (!m) return;
        const mat = m.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = Math.min(1, finalOp);
      });

      // Pupil tracking — project screen-space mouse into this eye's plane,
      // clamp the iris/pupil offset within the sclera.
      tmpVec.set(scrollState.mouseX, scrollState.mouseY, 0.5).unproject(cam);
      const dir = tmpVec.sub(cam.position).normalize();
      if (Math.abs(dir.z) < 0.001) return;
      const t = (eye.pos[2] - cam.position.z) / dir.z;
      const wx = cam.position.x + dir.x * t;
      const wy = cam.position.y + dir.y * t;
      const dx = wx - eye.pos[0];
      const dy = wy - eye.pos[1];
      const mag = Math.sqrt(dx * dx + dy * dy);
      const max = 0.32 / eye.scale; // in local-space units before scale
      const nx = mag > 0 ? (dx / mag) * Math.min(max, mag * 0.08) : 0;
      const ny = mag > 0 ? (dy / mag) * Math.min(max, mag * 0.08) : 0;
      // Smooth toward target
      iris.position.x += (nx - iris.position.x) * Math.min(dt * 6, 1);
      iris.position.y += (ny - iris.position.y) * Math.min(dt * 6, 1);
      pupil.position.x = iris.position.x;
      pupil.position.y = iris.position.y;
    });
  });
  return (
    <group ref={group}>
      {eyes.map((e, i) => (
        <group key={i} position={e.pos} scale={e.scale} rotation={[0, 0, e.tilt]}>
          <mesh>
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial color="#d8c8a8" transparent opacity={0} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <circleGeometry args={[0.5, 32]} />
            <meshBasicMaterial color="#3a1818" transparent opacity={0} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <circleGeometry args={[0.2, 32]} />
            <meshBasicMaterial color="#000000" transparent opacity={0} toneMapped={false} />
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

    const cam = state.camera as THREE.PerspectiveCamera;
    // MOON FOLLOWS CAMERA — always 20 units ahead so it's never behind the
    // camera regardless of where we are inside the storm scroll range.
    const moonX = 0;
    const moonY = 3.2;
    const moonWorldZ = cam.position.z - 20;
    const moonSize = 13;
    if (group.current) group.current.position.set(moonX, moonY, moonWorldZ);
    const vec = new THREE.Vector3(scrollState.mouseX, scrollState.mouseY, 0.5).unproject(cam);
    const dir = vec.sub(cam.position).normalize();
    if (Math.abs(dir.z) > 0.001) {
      const t = (moonWorldZ - cam.position.z) / dir.z;
      const worldHitX = cam.position.x + dir.x * t;
      const worldHitY = cam.position.y + dir.y * t;
      const localU = (worldHitX - moonX) / moonSize + 0.5;
      const localV = (worldHitY - moonY) / moonSize + 0.5;
      uniforms.uMouse.value.set(localU, localV);
      const inside = localU > -0.3 && localU < 1.3 && localV > -0.3 && localV < 1.3 ? 1 : 0;
      uniforms.uMouseInside.value += (inside - uniforms.uMouseInside.value) * Math.min(dt * 8, 1);
    }
  });

  return (
    <group ref={group} position={[0, 3.2, -462]} renderOrder={999}>
      <mesh renderOrder={999}>
        <planeGeometry args={[13, 13]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={cloudVert}
          fragmentShader={moonFrag}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.NormalBlending}
        />
      </mesh>
      {/* Additive glow halo — bigger, softer, also reacts via same uniforms */}
      <mesh position={[0, 0, -0.1]} renderOrder={998}>
        <planeGeometry args={[26, 26]} />
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
          depthTest={false}
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
    return Array.from({ length: 10 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 70,
      z: -475 - Math.random() * 30,
      scale: 0.8 + Math.random() * 1.3,
      tilt: (Math.random() - 0.5) * 0.3,
    }));
  }, []);
  const flashIntensity = useRef(0);
  const flashNext = useRef(0);
  const activeBolt = useRef(-1);
  const secondBolt = useRef(-1);
  useFrame((_, dt) => {
    const p = scrollState.progress;
    const stormOp = envelope(p, CH.storm[0], CH.storm[1], 0.03);
    if (group.current) {
      group.current.visible = stormOp > 0.05;
      if (stormOp > 0.05) {
        const now = performance.now() / 1000;
        if (now > flashNext.current) {
          flashIntensity.current = 1;
          // Much more frequent strikes — storm feels alive
          flashNext.current = now + 0.35 + Math.random() * 1.0;
          activeBolt.current = Math.floor(Math.random() * bolts.length);
          // Sometimes two bolts at once
          secondBolt.current = Math.random() < 0.35 ? Math.floor(Math.random() * bolts.length) : -1;
        }
        flashIntensity.current = Math.max(0, flashIntensity.current - dt * 7);
        group.current.children.forEach((c, i) => {
          const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
          const vis = (i === activeBolt.current || i === secondBolt.current) ? flashIntensity.current : 0;
          if (m) m.opacity = vis * stormOp;
        });
      }
    }
  });
  return (
    <group ref={group}>
      {bolts.map((b, i) => (
        <mesh key={i} position={[b.x, 4, b.z]} rotation={[0, 0, b.tilt]} scale={b.scale}>
          <planeGeometry args={[0.35, 22]} />
          <meshBasicMaterial color="#f0f0ff" transparent opacity={0} toneMapped={false} blending={THREE.AdditiveBlending} />
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
    // Start fading grass in late storm so the descent feels like the clouds part.
    const op = envelope(scrollState.progress, CH.storm[1] - 0.01, 1.0, 0.05);
    uniforms.uOpacity.value = op;
    if (ref.current) ref.current.visible = op > 0.01;
  });
  return (
    // Huge ground plane, centered ahead of the field camera path and extending far.
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, -540]}>
      <planeGeometry args={[800, 800, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`
          uniform float uTime;
          uniform float uOpacity;
          varying vec2 vUv;
          float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
          float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}
          void main(){
            vec2 uv = vUv;
            // Distance from center of plane → for horizon fade (plane is aligned to XZ world)
            float dist = distance(uv, vec2(0.5));
            float blades = noise(uv * 600.0 + uTime * 0.3);
            float patches = fbm(uv * 18.0);
            vec3 grassDark = vec3(0.18, 0.42, 0.16);
            vec3 grassLight = vec3(0.52, 0.78, 0.30);
            vec3 grass = mix(grassDark, grassLight, patches);
            grass += (blades - 0.5) * 0.10;
            // soft darker patches (tree shadows-ish) + sunny spots
            grass *= 0.85 + 0.3 * fbm(uv * 6.0 + 3.0);
            // blend to horizon/sky blue at the plane's outer ring — kept
            // narrow so most of the plane stays green (field feels infinite).
            vec3 horizon = vec3(0.78, 0.88, 0.96);
            float fade = smoothstep(0.42, 0.50, dist);
            grass = mix(grass, horizon, fade * 0.98);
            float alpha = uOpacity * (1.0 - smoothstep(0.48, 0.50, dist) * 0.0);
            gl_FragColor = vec4(grass, alpha);
          }
        `}
      />
    </mesh>
  );
}

function House() {
  const group = useRef<THREE.Group>(null!);
  useFrame(() => {
    // Visible during storm→field descent. Fades out BEFORE we fly through the
    // front wall (late-field) so the camera never collides with opaque geometry.
    const op = envelope(scrollState.progress, CH.storm[1] - 0.01, CH.field[1] - 0.01, 0.025);
    if (group.current) {
      group.current.visible = op > 0.01;
      group.current.traverse((o) => {
        const mesh = o as THREE.Mesh;
        const m = mesh.material as THREE.MeshStandardMaterial | undefined;
        if (m && 'opacity' in m) m.opacity = op;
      });
    }
  });
  return (
    // House sitting ON TOP of the hill (y>0 so it's perched, not sunk).
    <group ref={group} position={[0, 0.6, -553]} scale={2.0}>
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

/** Grassy mound — the "montezinho" under the house. Big dome so the house
 *  reads as perched on top of a hill. Fades out late-field alongside the house. */
function Hill() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    const op = envelope(scrollState.progress, CH.storm[1] - 0.01, CH.field[1] - 0.01, 0.04);
    if (ref.current) {
      ref.current.visible = op > 0.01;
      const m = ref.current.material as THREE.MeshStandardMaterial;
      if (m) m.opacity = op;
    }
  });
  return (
    <mesh
      ref={ref}
      position={[0, -1.5, -553]}
      scale={[16, 3.0, 14]}
    >
      <sphereGeometry args={[1, 48, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
      <meshStandardMaterial color="#3e6e22" roughness={1} transparent />
    </mesh>
  );
}

/** White fluffy clouds scattered across the blue sky during the field chapter. */
function FieldClouds() {
  const group = useRef<THREE.Group>(null!);
  const clouds = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; speed: number; tint: string; opacity: number }[] = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 140,
          6 + Math.random() * 14,
          -500 - Math.random() * 60,
        ],
        scale: 10 + Math.random() * 16,
        speed: 0.15 + Math.random() * 0.4,
        tint: '#ffffff',
        opacity: 0.85,
      });
    }
    return arr;
  }, []);
  useFrame(() => {
    const p = scrollState.progress;
    const op = envelope(p, CH.storm[1] - 0.01, CH.house[0], 0.04);
    if (group.current) {
      group.current.visible = op > 0.01;
      group.current.children.forEach((c) => {
        const m = (c as THREE.Mesh).material as THREE.ShaderMaterial;
        if (m && m.uniforms.uOpacity) m.uniforms.uOpacity.value = op * 0.9;
      });
    }
  });
  return <group ref={group}>{clouds.map((c, i) => <Cloud key={i} {...c} />)}</group>;
}

/** Inside-house computer monitor with contact info glowing */
/** Interior of the house — walls, floor, ceiling, desk and a monitor on the desk.
 * Camera enters during the house chapter and settles in front of the monitor. */
function HouseInterior() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(() => {
    // Fade the interior in during late-field so the transition is continuous
    // with the exterior fade-out: by p≈0.93 the interior is already present.
    const op = envelope(scrollState.progress, CH.field[1] - 0.03, CH.house[1] + 0.01, 0.025);
    if (!ref.current) return;
    ref.current.visible = op > 0.01;
    ref.current.traverse((o) => {
      const mesh = o as THREE.Mesh;
      const m = mesh.material as (THREE.MeshStandardMaterial | THREE.MeshBasicMaterial) | undefined;
      if (m && 'opacity' in m) m.opacity = op;
    });
  });
  // Room center world z=-570. Front opening at world z=-560. Back wall at
  // world z=-580. Camera arrives at z≈-568 (from CAMERA_Z[10]=-568) —
  // roughly 11 units in front of the monitor which sits ON THE BACK WALL.
  return (
    <group ref={ref} position={[0, 0, -570]}>
      {/* ambient fill so walls/floor/ceiling are readable, not pitch black */}
      <ambientLight intensity={0.55} color="#ffb880" />
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[28, 24]} />
        <meshStandardMaterial color="#6a4828" roughness={0.9} transparent />
      </mesh>
      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6.0, 0]}>
        <planeGeometry args={[28, 24]} />
        <meshStandardMaterial color="#4a3220" roughness={0.95} transparent />
      </mesh>
      {/* back wall (where monitor hangs) */}
      <mesh position={[0, 2.75, -10]}>
        <planeGeometry args={[28, 6.5]} />
        <meshStandardMaterial color="#8a6842" roughness={0.85} transparent />
      </mesh>
      {/* left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-14, 2.75, 0]}>
        <planeGeometry args={[24, 6.5]} />
        <meshStandardMaterial color="#7a5a38" roughness={0.85} transparent />
      </mesh>
      {/* right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[14, 2.75, 0]}>
        <planeGeometry args={[24, 6.5]} />
        <meshStandardMaterial color="#7a5a38" roughness={0.85} transparent />
      </mesh>
      {/* baseboard trim — helps read walls as walls */}
      <mesh position={[0, -0.3, -9.98]}>
        <planeGeometry args={[28, 0.35]} />
        <meshStandardMaterial color="#2a1a0c" roughness={0.9} transparent />
      </mesh>
      {/* desk top — placed against the back wall, under the monitor */}
      <mesh position={[0, 1.1, -8.2]}>
        <boxGeometry args={[10, 0.28, 3.2]} />
        <meshStandardMaterial color="#2a1808" roughness={0.55} metalness={0.15} transparent />
      </mesh>
      {/* desk legs */}
      <mesh position={[-4.5, 0.1, -8.2]}>
        <boxGeometry args={[0.32, 2.1, 0.32]} />
        <meshStandardMaterial color="#160c04" roughness={0.7} transparent />
      </mesh>
      <mesh position={[4.5, 0.1, -8.2]}>
        <boxGeometry args={[0.32, 2.1, 0.32]} />
        <meshStandardMaterial color="#160c04" roughness={0.7} transparent />
      </mesh>
      {/* keyboard — thin rectangle on desk */}
      <mesh position={[0, 1.26, -7.4]}>
        <boxGeometry args={[3.2, 0.08, 1.0]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.7} transparent />
      </mesh>
      {/* mouse */}
      <mesh position={[2.2, 1.26, -7.4]}>
        <boxGeometry args={[0.45, 0.08, 0.7]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.7} transparent />
      </mesh>
      {/* monitor stand — short pole from desk to monitor, placed near the back wall */}
      <mesh position={[0, 1.65, -9.0]}>
        <boxGeometry args={[0.3, 1.1, 0.3]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.3} transparent />
      </mesh>
      {/* monitor base plate */}
      <mesh position={[0, 1.25, -9.0]}>
        <boxGeometry args={[1.4, 0.08, 1.0]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.3} transparent />
      </mesh>
      {/* monitor bezel — mounted on BACK WALL (z=-9.85) */}
      <mesh position={[0, 2.85, -9.85]}>
        <boxGeometry args={[6.8, 3.9, 0.16]} />
        <meshStandardMaterial color="#050505" roughness={0.5} metalness={0.4} transparent />
      </mesh>
      {/* monitor screen — HTML terminal overlay sits on top of this in screen space */}
      <mesh position={[0, 2.85, -9.77]}>
        <planeGeometry args={[6.2, 3.4]} />
        <meshBasicMaterial color="#0a1220" transparent toneMapped={false} />
      </mesh>
      {/* screen bloom halo */}
      <mesh position={[0, 2.85, -9.76]}>
        <planeGeometry args={[8.2, 5.2]} />
        <meshBasicMaterial color="#6aa8ff" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* desk lamp bulb — warm glowing orb */}
      <mesh position={[4.0, 1.6, -8.2]}>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshBasicMaterial color="#ffc878" transparent toneMapped={false} />
      </mesh>
      {/* pictures on back wall */}
      <mesh position={[-6.5, 3.8, -9.94]}>
        <planeGeometry args={[2.0, 1.3]} />
        <meshStandardMaterial color="#9a6838" emissive="#4a2410" emissiveIntensity={0.35} transparent />
      </mesh>
      <mesh position={[6.5, 3.8, -9.94]}>
        <planeGeometry args={[2.0, 1.3]} />
        <meshStandardMaterial color="#8a5830" emissive="#4a2410" emissiveIntensity={0.35} transparent />
      </mesh>
      {/* lights — closer to camera so the room front is lit; one behind camera
       *  for general fill. Distances large enough to actually reach the walls. */}
      <pointLight position={[-5, 4.5, 3]} intensity={3.0} color="#ffa858" distance={28} decay={1.2} />
      <pointLight position={[5, 4.5, 3]} intensity={2.2} color="#ffb070" distance={26} decay={1.2} />
      <pointLight position={[4.0, 2.0, -8.2]} intensity={1.8} color="#ffcc80" distance={10} decay={1.4} />
      <pointLight position={[0, 2.85, -7.5]} intensity={1.2} color="#6aa8ff" distance={8} decay={1.4} />
    </group>
  );
}

/* ==================================================================
   CAMERA RIG — scripted dolly via cameraZAt()
   ================================================================== */

function CameraRig() {
  const { camera } = useThree();
  const current = useRef({ z: 5, x: 0, y: 0.3, rotZ: 0, lookY: 0 });
  const lookVec = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const p = scrollState.progress;
    const targetZ = cameraZAt(p);

    const baseX = scrollState.mouseX * 0.5;
    const baseY = 0.3 + scrollState.mouseY * 0.25;

    // Default targets — used for chapters up through storm.
    let targetY = baseY;
    let targetLookY = baseY * 0.3;

    // FIELD: cinematic descent — start WAY up in the sky, plunge down while
    // the look-target sweeps from horizon-height down to the house on the hill.
    if (p >= CH.storm[1] - 0.005 && p < CH.house[0]) {
      const d = Math.min(1, Math.max(0, (p - (CH.storm[1] - 0.005)) / (CH.field[1] - (CH.storm[1] - 0.005))));
      const skyY = 14;       // high above clouds
      const groundY = 2.2;   // chest-level looking toward house on hill
      // ease-out cubic → fast initial fall, gentle settle
      const ease = 1 - Math.pow(1 - d, 3);
      targetY = skyY + (groundY - skyY) * ease + scrollState.mouseY * 0.2;
      // Look down-forward: start looking nearly straight down, end looking at
      // the house on the hill (hill peak ~1.3, house roof ~5).
      const lookStart = skyY - 12;
      const lookEnd = 2.8;
      targetLookY = lookStart + (lookEnd - lookStart) * ease;
    }

    // HOUSE: seated at desk in front of monitor. Eye-level y≈2.85 so the
    // camera looks dead-center at the monitor (y=2.85 in HouseInterior).
    if (p >= CH.house[0]) {
      targetY = 2.85 + scrollState.mouseY * 0.06;
      targetLookY = 2.85 + scrollState.mouseY * 0.04;
    }

    const targetRotZ = Math.sin(p * Math.PI * 2) * 0.04 + scrollState.mouseX * 0.04;

    const k = Math.min(dt * 2.8, 1);
    current.current.z += (targetZ - current.current.z) * k;
    current.current.x += (baseX - current.current.x) * k;
    current.current.y += (targetY - current.current.y) * k;
    current.current.rotZ += (targetRotZ - current.current.rotZ) * k;
    current.current.lookY += (targetLookY - current.current.lookY) * k;

    camera.position.set(current.current.x, current.current.y, current.current.z);
    lookVec.set(current.current.x * 0.3, current.current.lookY, current.current.z - 10);
    camera.lookAt(lookVec);
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
      <Hill />
      <FieldClouds />
      <House />
      <HouseInterior />
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
