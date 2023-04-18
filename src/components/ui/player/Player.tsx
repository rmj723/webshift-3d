import React, { useEffect } from "react";
import "./Player.css";
import StatBar from "./StatBar/StatBar";

interface playerProps {
  name: string;
  image: string;
}
export default function Player({ name, image }: playerProps) {
  useEffect(() => {
    const playerPortaitId = document.querySelector(".player-portrait") as any;
    if (playerPortaitId) {
      playerPortaitId.style.backgroundImage = `url(${image})`;
    }
  }, []);

  return (
    <div className="player-stats-wrapper">
      <div className="player-portrait"></div>
      <div className="player-stats-container">
        <h1 className="player-name-h1">{name}</h1>

        <StatBar name={"Health"} color={"#f43855"} max={10} current={10} />
        <StatBar name={"Exp"} color={"#42e6ff"} max={100} current={0} />
      </div>
    </div>
  );
}
