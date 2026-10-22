"use client";

import { useTexture } from "@react-three/drei";
import Image from "next/image";
import { Suspense } from "react";
import { SRGBColorSpace, type Texture } from "three";

import { Pickable, type ItemProps } from "@/components/room/primitives";

export const shelfBooks = [
  { title: "The Metamorphosis of Prime Intellect", src: "/workspace/books/prime-intellect.jpg", height: 0.34, depth: 0.2, thickness: 0.036, spine: "#1c1824", pages: "#efe6d6", faceOut: true },
  { title: "Snow Crash", src: "/workspace/books/snow-crash.jpg", height: 0.35, depth: 0.2, thickness: 0.038, spine: "#0a1020", pages: "#e8e2d6", faceOut: false },
  { title: "Dune", src: "/workspace/books/dune.jpg", height: 0.37, depth: 0.22, thickness: 0.042, spine: "#5c3a14", pages: "#f0e6d4", faceOut: false },
  { title: "Permutation City", src: "/workspace/books/permutation-city.jpg", height: 0.33, depth: 0.19, thickness: 0.034, spine: "#243048", pages: "#ebe4d8", faceOut: false },
] as const;

function Book({
  height,
  depth,
  thickness,
  spine,
  pages,
  faceOut,
  cover,
  z,
}: (typeof shelfBooks)[number] & { cover: Texture; z: number }) {
  if (faceOut) {
    return (
      <mesh position={[thickness / 2, height / 2, z]} castShadow receiveShadow>
        <boxGeometry args={[thickness, height, depth]} />
        <meshStandardMaterial attach="material-0" map={cover} roughness={0.7} />
        <meshStandardMaterial attach="material-1" color={pages} roughness={0.9} />
        <meshStandardMaterial attach="material-2" color={pages} roughness={0.95} />
        <meshStandardMaterial attach="material-3" color={pages} roughness={0.95} />
        <meshStandardMaterial attach="material-4" color={spine} roughness={0.85} />
        <meshStandardMaterial attach="material-5" color={spine} roughness={0.85} />
      </mesh>
    );
  }

  return (
    <mesh position={[depth / 2, height / 2, z]} castShadow receiveShadow>
      <boxGeometry args={[depth, height, thickness]} />
      <meshStandardMaterial attach="material-0" color={spine} roughness={0.75} />
      <meshStandardMaterial attach="material-1" color={pages} roughness={0.9} />
      <meshStandardMaterial attach="material-2" color={pages} roughness={0.95} />
      <meshStandardMaterial attach="material-3" color={pages} roughness={0.95} />
      <meshStandardMaterial attach="material-4" map={cover} roughness={0.7} />
      <meshStandardMaterial attach="material-5" color={spine} roughness={0.85} />
    </mesh>
  );
}

function ShelfBooks() {
  const covers = useTexture(shelfBooks.map((book) => book.src));
  for (const texture of covers) texture.colorSpace = SRGBColorSpace;

  const gap = 0.012;
  const span = shelfBooks.reduce((sum, book) => sum + (book.faceOut ? book.depth : book.thickness), 0) + gap * (shelfBooks.length - 1);
  let z = span / 2;

  return shelfBooks.map((book, index) => {
    const along = book.faceOut ? book.depth : book.thickness;
    const mesh = <Book key={book.src} {...book} cover={covers[index]} z={z - along / 2} />;
    z -= along + gap;
    return mesh;
  });
}

export function BooksTip() {
  return (
    <div className="space-y-2">
      <p>Books I find interesting to read in the new AI age.</p>
      <div className="-mx-1 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:thin]">
        <div className="flex w-max gap-3 px-1">
          {shelfBooks.map((book) => (
            <figure key={book.src} className="w-[11.5rem] shrink-0">
              <Image
                src={book.src}
                alt={book.title}
                width={184}
                height={276}
                className="aspect-[2/3] h-auto w-full rounded-md object-cover ring-1 ring-foreground/10"
              />
              <figcaption className="mt-1.5 text-xs leading-snug text-muted-foreground">{book.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Books(props: ItemProps) {
  return (
    <Pickable {...props} tipY={0} tipBelow tipInteractive tipWidth="w-80" tipHalfWidth={160} position={[-1.88, 2.225, 0.435]}>
      <Suspense fallback={null}>
        <ShelfBooks />
      </Suspense>
    </Pickable>
  );
}
