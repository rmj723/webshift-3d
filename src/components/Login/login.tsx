import React from "react";
import { Button } from "@mui/material";
import useApp from "../../store/useApp";
import { Container, InputPanel } from "./login.style";

export const Login = () => {
  const [name, setName] = React.useState("Y-Bot");
  const { updateData } = useApp();

  return (
    <Container>
      <InputPanel>
        <p>Input Your Name</p>

        <input
          value={name}
          onChange={(e) => {
            e.stopPropagation();
            setName(e.target.value);
          }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            if (name !== "") updateData({ name });
          }}
        >
          Enter
        </Button>
      </InputPanel>
    </Container>
  );
};
