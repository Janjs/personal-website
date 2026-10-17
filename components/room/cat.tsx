"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, RepeatWrapping, TubeGeometry, Vector3, type Group } from "three";

import { Part, Pickable, canvasTexture, type ItemProps } from "@/components/room/primitives";

const fur = "#e8964a";
const darkFur = "#cf7634";

const spots = [[0.4, 0.4], [1.3, 1.1], [-0.6, 1.3], [1, -0.4], [-0.9, 0.3]] as const;
const legs = [[-0.09, 0.14, 0], [0.09, 0.14, Math.PI], [-0.09, -0.2, Math.PI], [0.09, -0.2, 0]] as const;

function stripes() {
  const texture = canvasTexture(256, 256, (ctx) => {
    ctx.fillStyle = fur;
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = darkFur;
    for (let y = 40; y < 220; y += 34) {
      ctx.beginPath();
      ctx.ellipse(128, y, 140, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  texture.wrapS = RepeatWrapping;
  return texture;
}

const tailCurve = new CatmullRomCurve3([
  new Vector3(0, 0.12, -0.3),
  new Vector3(0.12, 0.05, -0.36),
  new Vector3(0.24, 0.04, -0.22),
  new Vector3(0.26, 0.04, 0),
  new Vector3(0.2, 0.04, 0.16),
]);

export function Cat({ pets, active, ...props }: ItemProps & { pets: number }) {
  const walker = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const head = useRef<Group>(null);
  const tail = useRef<Group>(null);
  const eyes = useRef<Group>(null);
  const heart = useRef<Group>(null);
  const paws = useRef<Group>(null);
  const legRefs = useRef<(Group | null)[]>([]);
  const lastPets = useRef(pets);
  const petStart = useRef(-10);
  const wander = useRef({ target: 1, sitUntil: 2, stand: 0 });
  const furTexture = useMemo(() => stripes(), []);
  const tailGeometry = useMemo(() => new TubeGeometry(tailCurve, 48, 0.035, 12), []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (pets !== lastPets.current) {
      lastPets.current = pets;
      petStart.current = t;
    }
    const since = t - petStart.current;
    const petting = since < 1.6;
    const ease = petting ? Math.sin((since / 1.6) * Math.PI) : 0;

    const cat = walker.current;
    if (!cat) return;
    const state = wander.current;
    const [targetX, targetZ] = spots[state.target];
    const dx = targetX - cat.position.x;
    const dz = targetZ - cat.position.z;
    const distance = Math.hypot(dx, dz);
    const free = !active && !petting && t > state.sitUntil;
    const walking = free && distance > 0.02;

    if (walking) {
      const step = Math.min(distance, delta * 0.45);
      cat.position.x += (dx / distance) * step;
      cat.position.z += (dz / distance) * step;
      const turn = Math.atan2(dx, dz) - cat.rotation.y;
      cat.rotation.y += Math.atan2(Math.sin(turn), Math.cos(turn)) * (1 - Math.exp(-delta * 8));
    } else if (free) {
      state.sitUntil = t + 3 + Math.random() * 4;
      state.target = (state.target + 1 + Math.floor(Math.random() * (spots.length - 1))) % spots.length;
    }

    state.stand += ((walking ? 1 : 0) - state.stand) * (1 - Math.exp(-delta * 6));
    torso.current?.position.set(0, 0.12 * state.stand, 0);
    paws.current?.scale.setScalar(Math.max(0.001, 1 - state.stand));
    legRefs.current.forEach((leg, index) => {
      leg?.scale.set(1, Math.max(0.001, state.stand), 1);
      leg?.rotation.set(walking ? Math.sin(t * 10 + legs[index][2]) * 0.5 : 0, 0, 0);
    });

    head.current?.rotation.set(-0.45 * ease, 0, 0.15 * ease);
    eyes.current?.scale.set(1, 1 - 0.85 * ease, 1);
    tail.current?.rotation.set(0, Math.sin(t * (petting ? 9 : walking ? 4 : 1.5)) * 0.12, 0);
    if (heart.current) {
      heart.current.visible = petting;
      heart.current.position.y = 0.62 + since * 0.25;
      heart.current.scale.setScalar(ease);
    }
  });

  return (
    <group ref={walker} position={[spots[0][0], 0, spots[0][1]]} rotation={[0, Math.PI / 4, 0]}>
      <Pickable active={active} {...props} tipY={0.85}>
        {legs.map(([x, z], index) => (
          <group key={index} ref={(leg) => { legRefs.current[index] = leg; }} position={[x, 0.24, z]}>
            <Part color={fur} roughness={0.9} position={[0, -0.12, 0]}><capsuleGeometry args={[0.035, 0.17, 8, 16]} /></Part>
          </group>
        ))}
        <group ref={torso}>
          <mesh position={[0, 0.17, -0.04]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <capsuleGeometry args={[0.17, 0.24, 16, 32]} />
            <meshStandardMaterial map={furTexture} roughness={0.9} />
          </mesh>
          <group ref={paws}>
            {[-0.08, 0.08].map((x) => (
              <Part key={x} color="#f6d2a8" position={[x, 0.04, 0.2]} scale={[1, 0.7, 1.4]}><sphereGeometry args={[0.05, 24, 16]} /></Part>
            ))}
          </group>
          <group ref={head} position={[0, 0.3, 0.18]}>
            <Part color={fur} roughness={0.9} position={[0, 0.04, 0]} scale={[1.08, 0.95, 1]}><sphereGeometry args={[0.14, 48, 32]} /></Part>
            <Part color="#f6d2a8" position={[0, -0.01, 0.1]} scale={[1.3, 0.8, 0.8]}><sphereGeometry args={[0.055, 24, 16]} /></Part>
            {[-1, 1].map((side) => (
              <group key={side} position={[side * 0.08, 0.16, -0.01]} rotation={[0, 0, -side * 0.3]}>
                <Part color={darkFur} scale={[1, 1, 0.55]}><coneGeometry args={[0.05, 0.1, 24]} /></Part>
                <Part color="#f0a7a0" position={[0, -0.01, 0.012]} scale={[1, 1, 0.4]}><coneGeometry args={[0.03, 0.065, 24]} /></Part>
              </group>
            ))}
            <group ref={eyes} position={[0, 0.06, 0.122]}>
              {[-0.052, 0.052].map((x) => (
                <Part key={x} color="#2b2118" roughness={0.2} position={[x, 0, 0]} scale={[1, 1.2, 0.6]}><sphereGeometry args={[0.02, 16, 12]} /></Part>
              ))}
            </group>
            <Part color="#d9707a" position={[0, 0.02, 0.14]} scale={[1.3, 0.8, 0.8]}><sphereGeometry args={[0.012, 16, 12]} /></Part>
          </group>
          <group ref={tail}>
            <mesh geometry={tailGeometry} castShadow receiveShadow>
              <meshStandardMaterial color={darkFur} roughness={0.9} />
            </mesh>
          </group>
          <group ref={heart} visible={false} position={[0, 0.62, 0.15]}>
            {[-0.03, 0.03].map((x) => (
              <Part key={x} color="#e46a7c" position={[x, 0, 0]}><sphereGeometry args={[0.04, 24, 16]} /></Part>
            ))}
            <Part color="#e46a7c" position={[0, -0.045, 0]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.058, 0.08, 24]} /></Part>
          </group>
        </group>
      </Pickable>
    </group>
  );
}
