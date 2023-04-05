import React from "react";
import "./Item.css";
interface ItemProps {
  image: string;
}
export default function Item({ image }: ItemProps) {
  return (
    <div className="item-wrapper">
      <img className="item-image" src={image}></img>
    </div>
  );
}
