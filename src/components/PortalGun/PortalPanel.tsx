import React from "react";
import { Box, Button, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { ITextField } from "./ITextField";
import useApp from "../../store/useApp";
import { gpsToPos } from "../../utils/gpsToPos";
import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const Container = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const ButtonPanel = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  pointer-events: all;
`;

const InputPanel = styled.div`
  position: absolute;
  top: calc(50% - 50px);
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 150px;
  background: #44588e;
  border-radius: 10px;
  pointer-events: all;
  padding: 20px;
`;

export const PortalPanel = () => {
  const { state } = useApp();
  const [showInput, setShowInput] = React.useState(false);
  const [long, setLong] = React.useState(-73.9730278);
  const [lat, setLat] = React.useState(40.7636166);

  return (
    <Container>
      <ButtonPanel>
        <Button
          variant="contained"
          onClick={() => {
            setShowInput(true);
          }}
          sx={{
            backgroundColor: "#112233",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#50433a",
            },
          }}
        >
          Portal Gun
        </Button>
      </ButtonPanel>

      {showInput && (
        <InputPanel>
          <Typography color="white" fontSize={"18px"}>
            Input Location
          </Typography>
          <Box
            component="div"
            display={"flex"}
            justifyContent={"space-between"}
            mt={1}
            sx={{
              "& > div": { width: "48%" },
            }}
          >
            <ITextField
              label="Longitude"
              value={long}
              onChange={(v) => {
                setLong(v);
              }}
            />
            <ITextField
              label="Latitude"
              value={lat}
              onChange={(v) => setLat(v)}
            />
          </Box>

          <Box
            component="div"
            display={"flex"}
            justifyContent={"space-between"}
            mt={"25px"}
            sx={{
              "& > :not(style)": { width: "48%" },
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setShowInput(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setShowInput(false);
                const { avatar, orbit, camera, originGPS } = state;
                // const pos = gpsToPos([long, lat], state.originGPS);
                const pos = gpsToPos([long, lat], [-73.9730278, 40.7636166]);
                avatar.position.x = pos[0];
                avatar.position.z = pos[1];
                orbit.target.copy(avatar.position);
                camera.position.set(pos[0] + 5, 4, pos[1] - 10);
                orbit.update();
              }}
            >
              Teleport
            </Button>
          </Box>
        </InputPanel>
      )}
    </Container>
  );
};
