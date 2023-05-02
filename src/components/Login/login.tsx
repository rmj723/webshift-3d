import React from "react";
import { Button } from "@mui/material";
import useApp from "../../store/useApp";
import { Container, InputPanel } from "./login.style";

export const Login = () => {
  const [name, setName] = React.useState("Y-Bot");
  const {
    state,
    data: { avatarType },
    updateData,
  } = useApp();

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

        <p>Select Avatar</p>

        <select
          value={avatarType}
          onChange={(e) => {
            updateData({ avatarType: e.target.value });
            state.avatarType = e.target.value;
          }}
        >
          <option value="aj">AJ</option>
          <option value="ybot">YBot</option>
          <option value="amy">Amy</option>
        </select>

        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            if (name !== "") {
              updateData({ authenticated: true });
              state.avatarName = name;
            }
          }}
        >
          Enter
        </Button>
      </InputPanel>
    </Container>
  );
};
