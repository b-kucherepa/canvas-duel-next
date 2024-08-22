"use client";

import Character from "@/classes/Character";
import { ChangeEvent, useEffect, useState } from "react";

type Props = { character: Character };

export default function Menu(props: Props) {
  const [isVisible, setIsVisible] = useState(false);

  function handleCloseClick() {
    props.character.closeMenu();
    setIsVisible(props.character.isMenuOpened);
  }

  function handleColorChange(event: ChangeEvent<HTMLInputElement>): void {
    props.character.color = event.target.value;
  }

  function handleShotColorChange(event: ChangeEvent<HTMLInputElement>): void {
    props.character.shotColor = event.target.value;
  }

  function handleCharacterSpeedChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    props.character.speed = parseInt(event.target.value);
  }

  function handleFireRateChange(event: ChangeEvent<HTMLInputElement>): void {
    props.character.fireRate = Math.round(1 / parseFloat(event.target.value));
  }

  function handleShotSpeedChange(event: ChangeEvent<HTMLInputElement>): void {
    props.character.shotSpeed = parseInt(event.target.value);
  }

  useEffect(() => {
    window.addEventListener("click", () =>
      setIsVisible(props.character.isMenuOpened)
    );
  }, []);

  return (
    <div className="menu" style={{ display: isVisible ? "flex" : "none" }}>
      <h1>Options</h1>
      <label className="menu-item">
        Character color:
        <input
          type="color"
          defaultValue={props.character.color}
          onChange={handleColorChange}
        ></input>
      </label>

      <label className="menu-item">
        Shot color:
        <input
          type="color"
          defaultValue={props.character.shotColor}
          onChange={handleShotColorChange}
        ></input>
      </label>

      <label className="menu-item">
        Character speed:
        <input
          type="range"
          defaultValue={props.character.speed}
          min={1}
          max={50}
          step={1}
          onChange={handleCharacterSpeedChange}
        ></input>
      </label>

      <label className="menu-item">
        Fire rate:
        <input
          type="range"
          defaultValue={1 / props.character.fireRate}
          min={0.02}
          max={1}
          step={0.02}
          onChange={handleFireRateChange}
        ></input>
      </label>

      <label className="menu-item">
        Shot speed:
        <input
          type="range"
          defaultValue={props.character.shotSpeed}
          min={1}
          max={100}
          step={1}
          onChange={handleShotSpeedChange}
        ></input>
      </label>

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
