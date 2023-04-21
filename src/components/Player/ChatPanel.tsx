import styled from "styled-components";
import { Html } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import React from "react";

const ChatBox = styled.div`
  width: 300px;
  height: 40px;
  background-color: #e6981b99;
  color: white;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 1.25rem #0a0b10;
  overflow: hidden;
`;

export const ChatPanel: React.FC<GroupProps> = ({ ...props }) => {
  const [visible, setVisible] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, [setMsg]);
  return (
    <group {...props}>
      {visible && (
        <Html position-y={2.5}>
          <ChatBox>{msg}</ChatBox>
        </Html>
      )}
    </group>
  );
};
