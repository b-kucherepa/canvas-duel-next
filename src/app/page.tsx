"use client";

import CanvasField from "@/components/CanvasField";
import { useEffect, useState } from "react";

export default function Home() {
  /*  const [canvasField, setCanvasField] = useState(<></>);

  useEffect(() => {
    function initializeCanvasField() {
      setCanvasField(<CanvasField />);
    }

    document.addEventListener("load", initializeCanvasField);

    return document.removeEventListener("load", initializeCanvasField);
  }, []); */

  return (
    <main>
      <CanvasField />
    </main>
  );
}
