import React from "react";
import { TextField } from "@mui/material";
import styled from "@emotion/styled";

const STextField = styled(TextField)(() => ({
  "& > label": {
    color: "white",
  },

  "& > div > input": {
    color: "white",
  },
}));

interface Props {
  value?: number;
  onChange?: (x: number) => void;
  label: string;
}

export const ITextField: React.FC<Props> = ({ label, value, onChange }) => {
  const [iValue, setIValue] = React.useState<string>(
    value ? value.toString() : ""
  );

  const handleInputChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9.-]/g, "");
    setIValue(newValue);
    onChange && onChange(parseFloat(newValue === "" ? 0 : newValue));
  };

  return (
    <STextField
      id="filled-basic"
      label={label}
      variant="filled"
      value={iValue}
      onChange={handleInputChange}
      inputProps={{ pattern: "[0-9]*" }}
    />
  );
};
