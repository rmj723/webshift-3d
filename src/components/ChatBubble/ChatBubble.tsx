import React from "react";
import styled from "styled-components";
import { GroupProps } from "@react-three/fiber";
import { Html } from "@react-three/drei";

const ChatBox = styled.div`
  width: 150px;
  height: 30px;
  background-color: #171717;
  color: white;
  font-size: 14px;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 1.25rem #818289;
  overflow: hidden;
`;

interface Props extends GroupProps {
  msg?: string;
}

export const ChatBubble: React.FC<Props> = ({ msg, ...otherProps }) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 10000);
    return () => {
      clearTimeout(timer);
    };
  }, [msg]);

  if (!msg) return <></>;

  return (
    <group {...otherProps}>
      {true && (
        <Html position={[-0.2, 3, 0]} center>
          <ChatBox>{msg} </ChatBox>
        </Html>
      )}
    </group>
  );
};
