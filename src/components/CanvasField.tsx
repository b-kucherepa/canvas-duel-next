"use client";

import useScene from "@/hooks/useScene";
import { ReactNode, useEffect } from "react";
import { useRef } from "react";
import Menu from "./Menu";

export default function CanvasField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scene = useScene();

  useEffect(() => {
    scene.canvas.className = "fullscreenCanvas";
    containerRef?.current?.appendChild(scene.canvas);
  }, []);

  return (
    <div ref={containerRef}>
      <Menu character={scene.player}></Menu>
      <Menu character={scene.enemy}></Menu>
    </div>
  );
}
