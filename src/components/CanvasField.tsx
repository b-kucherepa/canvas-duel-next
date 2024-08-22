"use client";

import useScene from "@/hooks/useScene";
import { useEffect } from "react";
import { useRef } from "react";
import Menu from "./Menu";

export default function CanvasField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scene = useScene();

  useEffect(() => {
    scene.canvas.className = "scene-canvas";
    containerRef?.current?.appendChild(scene.canvas);
  }, []);

  return (
    <div className="canvas-container" ref={containerRef}>
      <Menu character={scene.player}></Menu>
      <Menu character={scene.enemy}></Menu>
    </div>
  );
}
