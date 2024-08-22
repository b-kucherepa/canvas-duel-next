"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import Menu from "./Menu";
import Scene from "@/classes/Scene";

export default function CanvasField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [menus, setMenus] = useState(<></>);

  useEffect(() => {
    const scene = new Scene();
    scene.canvas.className = "scene-canvas";
    containerRef?.current?.appendChild(scene.canvas);
    setMenus(
      <>
        <Menu character={scene.player}></Menu>
        <Menu character={scene.enemy}></Menu>
      </>
    );
  }, []);

  return (
    <div className="canvas-container" ref={containerRef}>
      {menus}
    </div>
  );
}
