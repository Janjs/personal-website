"use client";

import { OrbitControls, useProgress } from "@react-three/drei";
import { EffectComposer, Outline, Selection } from "@react-three/postprocessing";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useRef, type ComponentRef, type ReactNode, type RefObject } from "react";
import { DoubleSide, Quaternion, Vector3, setConsoleFunction, type AmbientLight, type DirectionalLight, type Group, type HemisphereLight, type Material, type Object3D, type PointLight, type SpotLight } from "three";

import { bindRoomTheme, getRoomFx } from "@/components/room/room-fx";

setConsoleFunction((type, message, ...params) => {
  if (message.startsWith("THREE.Clock:")) return;
  console[type](message, ...params);
});

import { Basketball } from "@/components/room/basketball";
import { Desk } from "@/components/room/desk-setup";
import { Cat } from "@/components/room/cat";
import { Furniture } from "@/components/room/furniture";
import { duckHome } from "@/components/room/floor-collision";
import { Guitar } from "@/components/room/guitar";
import { Microduck } from "@/components/room/microduck";
import { RecordPlayer } from "@/components/room/record-player";
import { GuinnessPint, SagradaFamilia, SeoulTower } from "@/components/room/souvenirs";
import { Poster, Window } from "@/components/room/wall-art";

export type RoomItemId = "desk" | "guitar" | "vinyl" | "cat" | "microduck" | "poster" | "basketball" | "window" | "barcelona" | "seoul" | "dublin";

function fitZoom(size: { width: number; height: number }) {
  // Keep the room at its original scale inside the canvas's 20% bleed on each side.
  return Math.min(size.width, size.height) / 1.4 / 6.1;
}

function RoomControls({ locked, focus, monitor, onSettled }: { locked: boolean; focus: "room" | "monitor"; monitor: RefObject<Object3D | null>; onSettled: () => void }) {
  const size = useThree((state) => state.size);
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const home = useRef({ pos: new Vector3(1.8, 7.2, 15), zoom: 40, target: new Vector3() });
  const progress = useRef(0);
  const announced = useRef<"room" | "monitor" | null>(null);
  const screen = useRef(new Vector3(-0.4, -0.1, -1.65));
  const focusPos = useRef(new Vector3());
  const lastGoal = useRef(0);
  const travel = useRef({ from: 0, to: 0, start: 0, running: false });
  const fit = fitZoom(size);

  useFrame(({ camera, size: frameSize }) => {
    const nextFit = fitZoom(frameSize);
    const orbit = controls.current;
    const goal = focus === "monitor" ? 1 : 0;
    if (lastGoal.current !== goal) {
      lastGoal.current = goal;
      travel.current = { from: progress.current, to: goal, start: performance.now(), running: true };
    }
    if (travel.current.running) {
      const u = Math.min(1, (performance.now() - travel.current.start) / 720);
      const ease = u < 0.5 ? 4 * u * u * u : 1 - (2 - 2 * u) ** 3 / 2;
      progress.current = travel.current.from + (travel.current.to - travel.current.from) * ease;
      if (u >= 1) {
        progress.current = travel.current.to;
        travel.current.running = false;
      }
    }

    const idle = goal === 0 && !travel.current.running;
    if (idle && orbit && Math.abs(camera.zoom - nextFit) < 2) {
      home.current.pos.copy(camera.position);
      home.current.zoom = nextFit;
      home.current.target.copy(orbit.target);
    } else if (idle) {
      home.current.zoom = nextFit;
    }

    monitor.current?.getWorldPosition(screen.current);
    focusPos.current.set(screen.current.x + 0.38, screen.current.y + 0.2, screen.current.z + 0.52);

    const t = progress.current;
    if (t > 0.001 || !idle) {
      camera.position.lerpVectors(home.current.pos, focusPos.current, t);
      const destZoom = Math.max(nextFit * 6.2, 200);
      camera.zoom = Math.exp(Math.log(Math.max(home.current.zoom, 1)) * (1 - t) + Math.log(destZoom) * t);
      camera.updateProjectionMatrix();
      if (orbit) {
        orbit.target.lerpVectors(home.current.target, screen.current, t);
        orbit.update();
      }
    } else {
      camera.zoom = nextFit;
      if (camera.position.distanceTo(home.current.pos) > 0.4) {
        camera.position.copy(home.current.pos);
        if (orbit) {
          orbit.target.copy(home.current.target);
          orbit.update();
        }
      }
      camera.updateProjectionMatrix();
    }

    if (!travel.current.running && goal === 1 && announced.current !== "monitor") {
      announced.current = "monitor";
      onSettled();
    }
    if (!travel.current.running && goal === 0 && announced.current !== "room") {
      announced.current = "room";
      onSettled();
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={!locked}
      enableZoom={false}
      enablePan={false}
      minZoom={fit}
      maxZoom={fit * 8}
      minAzimuthAngle={-0.25}
      maxAzimuthAngle={0.95}
      minPolarAngle={0.55}
      maxPolarAngle={1.35}
      rotateSpeed={0.6}
    />
  );
}

function Float({ seed, children }: { seed: number; children: ReactNode }) {
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    const { meltUntil, lights, konami } = getRoomFx();
    const now = performance.now();
    const melting = now < meltUntil;
    const party = lights === "party" || konami;
    if (!melting && !party && Math.abs(group.position.x) < 0.0004 && Math.abs(group.position.y) < 0.0004) return;
    const t = now * 0.001;
    const x = melting ? Math.sin(t * 18 + seed) * 0.16 : 0;
    const y = melting ? -0.35 * Math.sin(((meltUntil - now) / 2400) * Math.PI) : party ? Math.sin(t * 5 + seed) * 0.05 : 0;
    const z = melting ? Math.cos(t * 14 + seed) * 0.1 : 0;
    const ease = 1 - Math.exp(-delta * 5);
    group.position.x += (x - group.position.x) * ease;
    group.position.y += (y - group.position.y) * ease;
    group.position.z += (z - group.position.z) * ease;
    group.rotation.z += ((melting ? Math.sin(t + seed) * 0.08 : 0) - group.rotation.z) * ease;
  });

  return <group ref={ref}>{children}</group>;
}

function RoomSpot({ dark }: { dark: boolean }) {
  const spot = useRef<SpotLight>(null);
  useFrame(() => {
    if (!spot.current) return;
    spot.current.intensity = getRoomFx().lights === "off" ? 2 : dark ? 16 : 6;
  });
  return (
    <spotLight ref={spot} position={[0.35, 3.2, 0.35]} angle={0.7} penumbra={1} intensity={dark ? 16 : 6} distance={7} decay={2} color={dark ? "#ffe1a8" : "#ffe0b2"}>
      <object3D attach="target" position={[0.35, 0.03, 0.35]} />
    </spotLight>
  );
}

const sunHome = new Vector3(1.8, 7.2, 15).normalize();
const sunFrom = new Vector3();
const sunRest = new Vector3(1.4, 4.2, -5.2);
const sunTurn = new Quaternion();

function SceneLights({ dark }: { dark: boolean }) {
  const hemi = useRef<HemisphereLight>(null);
  const ambient = useRef<AmbientLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const partyA = useRef<PointLight>(null);
  const partyB = useRef<PointLight>(null);
  const glow = useRef<PointLight>(null);

  useFrame(({ camera, clock }) => {
    const { lights, konami, celebrateUntil } = getRoomFx();
    const party = lights === "party" || konami || performance.now() < celebrateUntil;
    const off = lights === "off";
    if (hemi.current) {
      hemi.current.intensity = off ? 0.06 : party ? 0.7 : dark ? 0.4 : 1.1;
      if (party) hemi.current.color.setHSL((clock.elapsedTime * 0.12) % 1, 0.55, 0.7);
      else hemi.current.color.set(dark ? "#ffe1a8" : "#ffe0b2");
    }
    if (ambient.current) ambient.current.intensity = off ? 0.04 : dark ? 0.22 : 0.65;
    if (sun.current) {
      sun.current.intensity = off ? 0.04 : party ? (dark ? 0.5 : 1.4) : dark ? 0.26 : 1.2;
      if (!dark && camera.position.lengthSq() > 64) {
        sunFrom.copy(camera.position).normalize();
        sunTurn.setFromUnitVectors(sunHome, sunFrom);
        sun.current.position.copy(sunRest).applyQuaternion(sunTurn);
      }
    }
    if (glow.current) glow.current.intensity = off ? 1.4 : 0.15;
    if (partyA.current && partyB.current) {
      const on = party ? 1.8 : 0;
      partyA.current.intensity = on;
      partyB.current.intensity = on;
      partyA.current.color.setHSL((clock.elapsedTime * 0.2) % 1, 0.8, 0.6);
      partyB.current.color.setHSL((clock.elapsedTime * 0.2 + 0.45) % 1, 0.8, 0.6);
    }
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={[dark ? "#ffe1a8" : "#ffe0b2", dark ? "#332319" : "#d9be98", dark ? 0.4 : 1.1]} />
      <ambientLight ref={ambient} intensity={dark ? 0.22 : 0.65} color={dark ? "#ffcf96" : "#fff4e2"} />
      <directionalLight
        ref={sun}
        castShadow
        position={dark ? [5.5, 9, 4] : [1.4, 4.2, -5.2]}
        intensity={dark ? 0.26 : 1.2}
        color={dark ? "#ffe1a8" : "#ffe0b2"}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={16}
        shadow-camera-left={-4.5}
        shadow-camera-right={4.5}
        shadow-camera-top={4.5}
        shadow-camera-bottom={-4.5}
        shadow-bias={-0.0002}
        shadow-normalBias={0.01}
      />
      <pointLight ref={glow} position={[-0.4, 0.05, -1.35]} color="#9ecbff" intensity={0.15} distance={2.4} decay={2} />
      <pointLight ref={partyA} position={[1.2, 2.4, 0.4]} intensity={0} distance={6} decay={2} />
      <pointLight ref={partyB} position={[-1.4, 2.1, 1.1]} intensity={0} distance={6} decay={2} />
    </>
  );
}

function SceneReady({ onReady }: { onReady: () => void }) {
  const ready = useRef(false);

  useFrame(() => {
    if (ready.current) return;
    ready.current = true;
    requestAnimationFrame(onReady);
  });

  return null;
}

function NoShadowGroup({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    ref.current?.traverse((obj) => {
      if (obj.castShadow) obj.castShadow = false;
    });
  });
  return <group ref={ref}>{children}</group>;
}

function ProgressReporter({ onProgress }: { onProgress: (progress: number) => void }) {
  const { progress } = useProgress();

  useEffect(() => onProgress(progress), [onProgress, progress]);

  return null;
}

export function RoomScene({ selected, playing, pets, quotes, focus, onSelect, onDuckMet, onProgress, onReady, onOpenMonitor, onFocusSettled, terminal, terminalHot }: {
  selected: RoomItemId | null;
  playing: boolean;
  pets: number;
  quotes: Record<RoomItemId, ReactNode>;
  focus: "room" | "monitor";
  onSelect: (id: RoomItemId | null) => void;
  onDuckMet: () => void;
  onProgress: (progress: number) => void;
  onReady: () => void;
  onOpenMonitor: () => void;
  onFocusSettled: () => void;
  terminal?: ReactNode;
  terminalHot?: boolean;
}) {
  const catPosition = useRef(new Vector3(0.65, 0, 0.4));
  const duckPosition = useRef(duckHome.clone());
  const encounter = useRef({ startedAt: -10, touching: false, met: false });
  const monitor = useRef<Object3D>(null);
  const { resolvedTheme, setTheme } = useTheme();
  bindRoomTheme(setTheme);
  const dark = resolvedTheme === "dark";
  const glow = dark ? 0xffd28a : 0xffffff;
  const pick = (id: RoomItemId) => ({ active: selected === id, onSelect: () => onSelect(id), tip: quotes[id], mute: focus !== "room" });

  return (
    <>
      <ProgressReporter onProgress={onProgress} />
      <Canvas
        style={{ position: "absolute", inset: "-20%", width: "140%", height: "140%", background: "transparent", touchAction: "none" }}
        gl={{ alpha: true, stencil: true, preserveDrawingBuffer: true }}
        orthographic
        flat
        shadows="percentage"
        dpr={[1, 2]}
        camera={{ position: [1.8, 7.2, 15], zoom: 40 }}
        onPointerMissed={() => onSelect(null)}
        role="img"
        aria-label="Isometric 3D workspace with a desk setup, guitar, cat, Microduck robot, record player, poster, basketball, and souvenirs"
      >
        <SceneReady onReady={onReady} />
        <RoomControls locked={selected === "microduck" || focus !== "room"} focus={focus} monitor={monitor} onSettled={onFocusSettled} />
      <SceneLights dark={dark} />
      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline
            ref={(effect) => {
              if (effect) (effect as unknown as { maskPass: { overrideMaterial: Material } }).maskPass.overrideMaterial.side = DoubleSide;
            }}
            blur
            edgeStrength={8}
            width={1200}
            visibleEdgeColor={glow}
            hiddenEdgeColor={glow}
          />
        </EffectComposer>
        <group position={[0.05, -1.65, 0.05]}>
          <RoomSpot dark={dark} />
          <Furniture dark={dark} />
          <Desk {...pick("desk")} dark={dark} monitorRef={monitor} onOpenMonitor={onOpenMonitor} terminal={terminal} hot={terminalHot} />
          <Float seed={1}><Guitar {...pick("guitar")} /></Float>
          <Cat {...pick("cat")} pets={pets} playing={playing} position={catPosition} duckPosition={duckPosition} encounter={encounter} />
          <Microduck {...pick("microduck")} catPosition={catPosition} position={duckPosition} encounter={encounter} onMet={onDuckMet} />
          <RecordPlayer {...pick("vinyl")} playing={playing} />
          <Float seed={2}><Basketball {...pick("basketball")} /></Float>
          <NoShadowGroup>
            <Poster {...pick("poster")} dark={dark} />
            <Window {...pick("window")} dark={dark} />
          </NoShadowGroup>
          <Float seed={3}><SagradaFamilia {...pick("barcelona")} /></Float>
          <Float seed={4}><SeoulTower {...pick("seoul")} /></Float>
          <Float seed={5}><GuinnessPint {...pick("dublin")} /></Float>
        </group>
      </Selection>
      </Canvas>
    </>
  );
}
