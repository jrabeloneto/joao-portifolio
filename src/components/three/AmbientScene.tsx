import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * AmbientScene — OPEN DREAMCORE FIELD behind the whole page.
 * Green field + blue-pink sky + constantly drifting clouds + sun.
 * Scrolling travels through the landscape (clouds roll, sun arcs, field recedes).
 * Content floats above — this is the world everything lives in.
 */

function FieldSkyShader() {
  const ref = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSky1: { value: new THREE.Color('#C4DFF5') },   // sky cyan
      uSky2: { value: new THREE.Color('#F5D9B8') },   // horizon peach
      uSky3: { value: new THREE.Color('#E8BCC8') },   // rose clouds
      uField1: { value: new THREE.Color('#9BB87A') }, // near grass
      uField2: { value: new THREE.Color('#C8D49A') }, // far grass
      uField3: { value: new THREE.Color('#E8DEB8') }, // horizon field
      uMist: { value: new THREE.Color('#BFB5D9') },
      uSun: { value: new THREE.Color('#FFE5A8') },
    }),
    []
  );

  useFrame((state, dt) => {
    uniforms.uTime.value += dt;
    const maxScroll =
      typeof document !== 'undefined'
        ? Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
        : 1;
    const y = typeof window !== 'undefined' ? window.scrollY : 0;
    uniforms.uScroll.value = y / maxScroll;
    uniforms.uMouse.value.lerp(
      new THREE.Vector2(state.pointer.x, state.pointer.y),
      Math.min(dt * 2.5, 1)
    );
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uScroll;
          uniform vec2 uMouse;
          uniform vec3 uSky1;
          uniform vec3 uSky2;
          uniform vec3 uSky3;
          uniform vec3 uField1;
          uniform vec3 uField2;
          uniform vec3 uField3;
          uniform vec3 uMist;
          uniform vec3 uSun;
          varying vec2 vUv;

          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p);
            f = f*f*(3.0-2.0*f);
            return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
                       mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
          }
          float fbm(vec2 p) {
            float v = 0.0; float a = 0.5;
            for (int i = 0; i < 6; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
            return v;
          }

          void main() {
            vec2 uv = vUv;

            // horizon line — rises/falls with scroll, giving the feel of traveling
            float horizon = 0.42 - uScroll * 0.18 + uMouse.y * 0.02;

            // ============ SKY ============
            vec3 sky;
            float skyY = (uv.y - horizon) / (1.0 - horizon);
            sky = mix(uSky2, uSky3, smoothstep(0.0, 0.35, skyY));
            sky = mix(sky, uSky1, smoothstep(0.35, 0.95, skyY));

            // sun — drifts right and down over scroll
            vec2 sunPos = vec2(0.28 + uScroll * 0.45 + uMouse.x * 0.03, horizon + 0.18 - uScroll * 0.05);
            float sunD = distance(uv * vec2(1.7, 1.0), sunPos * vec2(1.7, 1.0));
            float sunCore = smoothstep(0.06, 0.0, sunD);
            float sunHalo = smoothstep(0.28, 0.06, sunD);
            float sunGlow = smoothstep(0.55, 0.15, sunD);
            sky += uSun * sunCore * 0.9;
            sky += uSun * sunHalo * 0.3;
            sky += uSun * sunGlow * 0.08;

            // clouds drifting — multiple layers
            vec2 cUv = vec2(uv.x * 3.0 + uTime * 0.02 + uScroll * 0.6, (uv.y - horizon) * 3.0);
            float cloudsFar = fbm(cUv);
            float cloudMaskFar = smoothstep(0.48, 0.72, cloudsFar) * smoothstep(0.0, 0.15, skyY) * smoothstep(1.0, 0.6, skyY);
            sky = mix(sky, mix(uSky3, vec3(1.0, 0.96, 0.92), 0.6), cloudMaskFar * 0.55);

            vec2 cUv2 = vec2(uv.x * 1.6 - uTime * 0.035 - uScroll * 0.3, (uv.y - horizon) * 2.0 + 0.3);
            float cloudsNear = fbm(cUv2);
            float cloudMaskNear = smoothstep(0.52, 0.74, cloudsNear) * smoothstep(0.05, 0.4, skyY) * smoothstep(1.0, 0.75, skyY);
            sky = mix(sky, mix(uMist, vec3(1.0), 0.4), cloudMaskNear * 0.45);

            // ============ FIELD ============
            vec3 field;
            float fieldY = uv.y / max(horizon, 0.01);
            // near foreground (bottom) → far background (at horizon)
            vec3 fNear = uField1;
            vec3 fMid = uField2;
            vec3 fFar = mix(uField3, uSky2, 0.5);
            field = mix(fNear, fMid, smoothstep(0.0, 0.6, fieldY));
            field = mix(field, fFar, smoothstep(0.6, 1.0, fieldY));

            // grass stippling
            vec2 gUv = uv * vec2(400.0, 180.0);
            gUv.x += noise(uv * 6.0) * 8.0;
            float grass = noise(gUv);
            field += (grass - 0.5) * 0.08 * (1.0 - smoothstep(0.5, 1.0, fieldY));

            // larger patches
            float patch = fbm(uv * vec2(4.0, 2.0));
            field = mix(field, uField2, patch * 0.3);

            // mist layer at horizon (soft haze where field meets sky)
            float hazeBand = smoothstep(0.92, 1.0, fieldY) * smoothstep(1.08, 1.0, fieldY);
            field = mix(field, uSky2, hazeBand * 0.8);

            // ============ COMPOSITE ============
            float skyMask = smoothstep(horizon - 0.005, horizon + 0.005, uv.y);
            vec3 color = mix(field, sky, skyMask);

            // atmospheric mist drifting over everything (adds dreamcore haze)
            float mist = fbm(uv * vec2(2.0, 1.0) + uTime * 0.01);
            color = mix(color, uMist, mist * 0.08);

            // film grain
            float g = hash(uv * 800.0 + uTime);
            color += (g - 0.5) * 0.03;

            // vignette
            float vign = smoothstep(1.2, 0.4, distance(uv, vec2(0.5)));
            color *= 0.82 + 0.18 * vign;

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export function AmbientScene() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
      aria-hidden
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
      >
        <FieldSkyShader />
      </Canvas>
    </div>
  );
}
