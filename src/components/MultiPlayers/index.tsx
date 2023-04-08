import useApp from "../../store/useApp";
import { Player } from "../Player/Player";
import React from "react";

export const MultiPlayers = () => {
  const { state } = useApp();

  return (
    <>
      <Player position={[-2, 0, 0]} />
    </>
  );
};
