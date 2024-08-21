"use client";

import Character from "@/classes/Character";
import { useEffect, useState } from "react";

type Props = { character: Character };

export default function Curtain(props: Props) {
  const [isVisible, setIsVisible] = useState(false);
  function handleCloseClick() {
    props.character.closeMenu();
  }

  useEffect(() => {
    setIsVisible(props.character.isMenuOpened);
  }, [props.character.isMenuOpened]);

  return (
    <div className="menu" style={{ display: isVisible ? "flex" : "none" }}>
      Hey!
      <button
        type="button"
        className="btn-menu-close"
        onClick={handleCloseClick}
      >
        &times;
      </button>
    </div>
  );
}
