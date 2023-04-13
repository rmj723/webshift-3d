import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import styled from "@emotion/styled";
import useApp from "../../store/useApp";
import { GeolibInputCoordinates } from "geolib/es/types";

const Container = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-color: black;
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

export const Login = () => {
  const [name, setName] = React.useState("");
  const { updateData } = useApp();

  return (
    <Container>
      <InputPanel>
        <Typography color="white" fontSize={"18px"}>
          Input Your Name
        </Typography>
        <Box
          component="div"
          display={"flex"}
          justifyContent={"space-between"}
          sx={{ margin: "15px 0 10px 0" }}
        >
          <TextField
            fullWidth
            label="User Name"
            value={name}
            onChange={(e) => {
              e.stopPropagation();
              setName(e.target.value);
            }}
          />
        </Box>

        <Box
          component="div"
          display={"flex"}
          justifyContent={"space-between"}
          mt={"20px"}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              if (name !== "") updateData({ name });
            }}
          >
            Enter
          </Button>
        </Box>
      </InputPanel>
    </Container>
  );
};
