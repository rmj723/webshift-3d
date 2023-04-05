import React from "react";
import { Button } from "@mui/material";
import styled from "@emotion/styled";

const Container = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const PortalPanel = () => {
  return (
    <Container>
      <Button variant="contained">Portal</Button>
    </Container>
  );
};
