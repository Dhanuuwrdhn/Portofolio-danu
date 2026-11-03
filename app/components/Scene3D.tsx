"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Vertical distance between scenes. Each slide points the camera at one scene.
const SPACING = 10;
const SCENES = 5;
const DEPTH = SPACING * (SCENES - 1);
const TWEEN_MS = 1600;

export type Waypoint = {
  scene: number; // which 3D scene (0..SCENES-1) the slide looks at
  angle: number; // orbit angle around that scene, radians
  radius: number; // camera distance
};

// Deterministic PRNG so the layout is identical on every load.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Camera tweens between waypoints on a fixed curve (no scroll sampling → no jitter),
// with a small mouse parallax layered on top.
function Rig({
  waypoint,
  pointer,
}: {
  waypoint: Waypoint;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const from = useRef({ y: 0, angle: 0, radius: 7 });
  const cur = useRef({ y: 0, angle: 0, radius: 7 });
  const start = useRef(-1);
  const par = useRef({ x: 0, y: 0 });

  useEffect(() => {
    from.current = { ...cur.current };
    start.current = performance.now();
  }, [waypoint]);

  const { size } = useThree();
  // Portrait phones: pull the camera back and aim below the object so it floats above the text block.
  const portrait = size.width < size.height;
  const zoom = portrait ? 1.5 : 1;
  const aimDrop = portrait ? 1.6 : 0;

  useFrame(({ camera }, dt) => {
    const t = start.current < 0 ? 1 : Math.min(1, (performance.now() - start.current) / TWEEN_MS);
    const e = easeInOutCubic(t);
    const target = { y: -waypoint.scene * SPACING, angle: waypoint.angle, radius: waypoint.radius };
    cur.current = {
      y: THREE.MathUtils.lerp(from.current.y, target.y, e),
      angle: THREE.MathUtils.lerp(from.current.angle, target.angle, e),
      radius: THREE.MathUtils.lerp(from.current.radius, target.radius, e),
    };
    const k = 1 - Math.exp(-dt * 3);
    par.current.x = THREE.MathUtils.lerp(par.current.x, pointer.current.x, k);
    par.current.y = THREE.MathUtils.lerp(par.current.y, pointer.current.y, k);

    const { y, angle, radius } = cur.current;
    // Mid-tween the camera pulls back a little so the move reads as a flight, not a slide.
    const r = (radius + Math.sin(Math.PI * t) * 2.5) * zoom;
    camera.position.set(
      Math.sin(angle) * r + par.current.x * 0.6,
      y - aimDrop + par.current.y * 0.4,
      Math.cos(angle) * r,
    );
    camera.lookAt(0, y - aimDrop, 0);
  });
  return null;
}

// Pushes the whole world right on wide screens so it sits beside the text column.
function useSideOffset() {
  const { size } = useThree();
  return size.width / size.height > 1.2 ? 1.8 : 0;
}

// ---------- shared atmosphere ----------

// Soft smoke puff drawn once on a 2D canvas: many faint overlapping blobs.
function useSmokeTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const r = rng(7);
    for (let i = 0; i < 70; i++) {
      const x = 128 + (r() - 0.5) * 110;
      const y = 128 + (r() - 0.5) * 110;
      const rad = 25 + r() * 70;
      const grad = g.createRadialGradient(x, y, 0, x, y, rad);
      grad.addColorStop(0, "rgba(255,255,255,0.07)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Smoke() {
  const tex = useSmokeTexture();
  const puffs = useMemo(() => {
    const r = rng(11);
    // A few puffs clustered behind each scene.
    return Array.from({ length: SCENES * 3 }, (_, i) => ({
      pos: [(r() - 0.5) * 5, -Math.floor(i / 3) * SPACING + (r() - 0.5) * 4, -3 - r() * 3] as const,
      scale: 8 + r() * 5,
      spin: (r() - 0.5) * 0.06,
    }));
  }, []);
  const refs = useRef<(THREE.Sprite | null)[]>([]);
  useFrame((_, dt) => {
    refs.current.forEach((s, i) => {
      if (s) s.material.rotation += puffs[i].spin * dt;
    });
  });
  return (
    <>
      {puffs.map((p, i) => (
        <sprite
          key={i}
          ref={(s) => {
            refs.current[i] = s;
          }}
          position={p.pos}
          scale={p.scale}
        >
          <spriteMaterial map={tex} color="#6b6b6b" transparent opacity={0.6} depthWrite={false} />
        </sprite>
      ))}
    </>
  );
}

// Square "dust" points spread over the whole range, in two sizes for depth.
function Stars({ count = 900 }) {
  const [small, big] = useMemo(() => {
    const r = rng(3);
    const make = (n: number) => {
      const p = new Float32Array(n * 3);
      for (let i = 0; i < n; i++)
        p.set([(r() - 0.5) * 26, 8 - r() * (DEPTH + 16), (r() - 0.5) * 16], i * 3);
      return p;
    };
    return [make(count), make(Math.floor(count / 8))];
  }, [count]);
  return (
    <>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[small, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={0.03} transparent opacity={0.55} depthWrite={false} />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[big, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={0.08} transparent opacity={0.9} depthWrite={false} />
      </points>
    </>
  );
}

// Floating triangular shards drifting between scenes.
function Shards({ count = 22 }) {
  const shards = useMemo(() => {
    const r = rng(5);
    return Array.from({ length: count }, () => ({
      pos: [(r() - 0.5) * 8, 3 - r() * (DEPTH + 6), (r() - 0.5) * 6] as const,
      size: 0.12 + r() * 0.35,
      speed: 0.2 + r() * 0.4,
      phase: r() * Math.PI * 2,
    }));
  }, [count]);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const s = shards[i];
      m.rotation.set(t * s.speed + s.phase, t * s.speed * 0.7, s.phase);
      m.position.y = s.pos[1] + Math.sin(t * s.speed + s.phase) * 0.3;
    });
  });
  return (
    <>
      {shards.map((s, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          position={s.pos}
        >
          <circleGeometry args={[s.size, 3]} />
          <meshStandardMaterial color="#6a6a6a" emissive="#141414" side={THREE.DoubleSide} flatShading />
        </mesh>
      ))}
    </>
  );
}

// Long hairline streaks; a bundle passes through every scene.
function Streaks({ perScene = 18 }) {
  const positions = useMemo(() => {
    const r = rng(9);
    const n = perScene * SCENES;
    const p = new Float32Array(n * 6);
    for (let i = 0; i < n; i++) {
      const cy = -Math.floor(i / perScene) * SPACING;
      const ox = (r() - 0.5) * 2.5;
      const z = (r() - 0.5) * 3;
      const tilt = 0.3 + r() * 0.2;
      p.set([ox - 7 * tilt, cy - 7, z, ox + 7 * tilt, cy + 7, z], i * 6);
    }
    return p;
  }, [perScene]);
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.1} depthWrite={false} />
    </lineSegments>
  );
}

// ---------- glow beam (bright core + view-angle faded halo; no postprocessing needed) ----------

const UP = new THREE.Vector3(0, 1, 0);
const HALO_VERT = `
  varying float vFacing;
  void main() {
    vec3 n = normalize(normalMatrix * normal);
    vFacing = abs(n.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;
const HALO_FRAG = `
  uniform float uIntensity;
  varying float vFacing;
  void main() {
    gl_FragColor = vec4(vec3(1.0), pow(vFacing, 4.0) * 0.6 * uIntensity);
  }`;

function GlowBeam({
  from,
  to,
  intensity,
}: {
  from: THREE.Vector3Tuple;
  to: THREE.Vector3Tuple;
  intensity: React.MutableRefObject<number>;
}) {
  const { mid, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    return {
      mid: a.clone().add(b).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize()),
      len: dir.length(),
    };
  }, [from, to]);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const halo = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uIntensity: { value: 0 } }), []);
  useFrame(() => {
    if (core.current) core.current.opacity = intensity.current;
    if (halo.current) halo.current.uniforms.uIntensity.value = intensity.current;
  });
  return (
    <group position={mid} quaternion={quat}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, len, 12, 1]} />
        <meshBasicMaterial ref={core} color="#ffffff" transparent depthWrite={false} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.17, 0.17, len, 24, 1, true]} />
        <shaderMaterial
          ref={halo}
          uniforms={uniforms}
          vertexShader={HALO_VERT}
          fragmentShader={HALO_FRAG}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ---------- per-scene compositions ----------

// 0 · Intro: a triangle of neon tubes that flickers on, then breathes.
function NeonTriangle() {
  const group = useRef<THREE.Group>(null);
  const intensity = useRef(0);
  const corners = useMemo(
    () =>
      [0, 1, 2].map((i) => {
        const a = Math.PI / 2 + (i * Math.PI * 2) / 3;
        return [Math.cos(a) * 1.7, Math.sin(a) * 1.7, 0] as THREE.Vector3Tuple;
      }),
    [],
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    intensity.current =
      t < 1.8
        ? Math.sin(t * 38) > 0.25
          ? Math.min(1, t / 1.8)
          : 0.08
        : 0.82 + 0.18 * Math.sin(t * 1.2);
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.3) * 0.6;
      group.current.rotation.z = -0.3 + Math.sin(t * 0.2) * 0.05;
    }
  });
  return (
    <group ref={group}>
      {corners.map((c, i) => (
        <GlowBeam key={i} from={c} to={corners[(i + 1) % 3]} intensity={intensity} />
      ))}
      <GlowBeam from={[0, -2.4, 0]} to={[0, 2.4, 0]} intensity={intensity} />
    </group>
  );
}

// 1 · About: a ring of pale beams rising and falling like an equaliser.
function BeamRing({ count = 40 }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 1.9, 0, Math.sin(a) * 1.9);
      dummy.rotation.set(0, -a, 0);
      dummy.scale.set(1, 0.3 + 1.1 * (0.5 + 0.5 * Math.sin(t * 1.5 + i * 0.55)), 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.rotation.y = t * 0.12;
  });
  return (
    <group position={[0, -SPACING, 0]} rotation={[0.4, 0, 0]}>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.035, 1.6, 0.035]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}

// 2 · Experience: a rolling field of points.
function WaveField({ side = 56 }) {
  const ref = useRef<THREE.BufferGeometry>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(side * side * 3);
    for (let i = 0; i < side; i++)
      for (let j = 0; j < side; j++) {
        const k = (i * side + j) * 3;
        p[k] = (i / (side - 1) - 0.5) * 8;
        p[k + 2] = (j / (side - 1) - 0.5) * 8;
      }
    return p;
  }, [side]);
  useFrame(({ clock }) => {
    const geo = ref.current;
    if (!geo) return;
    const t = clock.elapsedTime;
    const arr = geo.attributes.position.array as Float32Array;
    for (let k = 0; k < arr.length; k += 3) {
      arr[k + 1] = 0.4 * Math.sin(arr[k] * 1.1 + t) + 0.28 * Math.cos(arr[k + 2] * 1.4 + t * 0.8);
    }
    geo.attributes.position.needsUpdate = true;
  });
  return (
    <points position={[0, -SPACING * 2 - 0.8, 0]} rotation={[0.35, 0, 0]}>
      <bufferGeometry ref={ref}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d9d9d9" size={0.035} transparent opacity={0.75} depthWrite={false} />
    </points>
  );
}

// 3 · Projects: a breathing sphere of points.
function ParticleSphere({ count = 1600 }) {
  const ref = useRef<THREE.Points>(null);
  // Fibonacci sphere: evenly spread points with no clustering at the poles.
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      p.set([Math.cos(golden * i) * r * 2, y * 2, Math.sin(golden * i) * r * 2], i * 3);
    }
    return p;
  }, [count]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.1;
    ref.current.scale.setScalar(1 + 0.06 * Math.sin(t * 1.6));
  });
  return (
    <points ref={ref} position={[0, -SPACING * 3, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.03} transparent opacity={0.8} depthWrite={false} />
    </points>
  );
}

// 4 · Contact: a slowly turning wire polyhedron.
function WireShell() {
  const ref = useRef<THREE.LineSegments>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.1, 1)), []);
  useEffect(() => () => edges.dispose(), [edges]);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.12;
    ref.current.rotation.x += dt * 0.05;
  });
  return (
    <lineSegments ref={ref} geometry={edges} position={[0, -SPACING * 4, 0]}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.4} depthWrite={false} />
    </lineSegments>
  );
}

function World() {
  const x = useSideOffset();
  return (
    <group position={[x, 0, 0]}>
      <Smoke />
      <Stars />
      <Streaks />
      <Shards />
      <NeonTriangle />
      <BeamRing />
      <WaveField />
      <ParticleSphere />
      <WireShell />
    </group>
  );
}

export default function Scene3D({
  waypoint,
  onReady,
}: {
  waypoint: Waypoint;
  onReady?: () => void;
}) {
  const pointer = useRef({ x: 0, y: 0 });

  // Canvas is pointer-events-none so it never blocks the UI; track the mouse on window instead.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0a0a0b");
          onReady?.();
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 4]} intensity={1.3} />
        <Rig waypoint={waypoint} pointer={pointer} />
        <World />
      </Canvas>
    </div>
  );
}
