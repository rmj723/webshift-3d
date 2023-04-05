import React, { useEffect } from "react";
import "./StatBar.css";
interface StatBarProps {
  name: string;
  color: string;
  max: number;
  current: number;
}
export default function StatBar({ name, color, max, current }: StatBarProps) {
  useEffect(() => {
    const statBar = document.querySelector(`#stat-${name}`) as HTMLElement;
    const x = (current / max) * 100; // Set x value here
    const percentage = x + "%";
    if (statBar) {
      statBar.style.width = percentage;
    }
  }, []);
  return (
    <div className="stat-bar-wrapper">
      <p className="stat-bar-name">{name}</p>
      <div className="stat-bar-bar">
        <div
          id={`stat-${name}`}
          className="stat-bar-fill"
          style={{ backgroundColor: color }}
        ></div>
        <p className="stat-bar-stat">
          {current}/{max}
        </p>
      </div>
    </div>
  );
}
