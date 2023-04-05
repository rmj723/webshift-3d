import styled from "styled-components";
import React from "react";

const Container = styled.div`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;
export const Loading = () => {
  return <Container>LOADING...</Container>;
};
