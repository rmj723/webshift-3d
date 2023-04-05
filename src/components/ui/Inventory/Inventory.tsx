import React, { useRef } from "react";
import "./Inventory.css";
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "./useDimensions";
import Item from "./Item/Item";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(35px at 180px 40px)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};
export default function Inventory() {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  return (
    <motion.div
      className="inventory-wrapper"
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
    >
      <motion.div className="inventory-icon background" variants={sidebar}>
        <div className="image-wrapper">
          <img
            onClick={() => {
              toggleOpen();
            }}
            className="icon-image"
            src="/images/inventory-icon.webp"
          ></img>
        </div>
        <p className="inventory-title">Inventory</p>
        <div className="items-wrapper">
          <Item image={"/images/inventory-icon.webp"} />
          <Item image={"/images/inventory-icon.webp"} />
          <Item image={"/images/inventory-icon.webp"} />
          <Item image={"/images/inventory-icon.webp"} />
          <Item image={"/images/inventory-icon.webp"} />
          <Item image={"/images/inventory-icon.webp"} />
        </div>
      </motion.div>
    </motion.div>
  );
}
