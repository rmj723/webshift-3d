import React from "react";
import { TextField } from "@mui/material";
import styled from "@emotion/styled";

const STextField = styled(TextField)(() => ({
  "& > label": {
    color: "white",
  },

  "& > label.Mui-focused": {
    color: "#cf4d4d",
  },

  "& > div > input": {
    color: "white",
  },

  "& > div": {
    borderRadius: "8px",
  },

  "& > div::before": {
    borderBottom: "none",
  },
  "& > div::after": {
    borderBottom: "none",
  },
  "& > div:hover:not(.Mui-disabled, .Mui-error):before": {
    borderBottom: "none",
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
      label={label}
      variant="filled"
      value={iValue}
      onChange={handleInputChange}
      inputProps={{ pattern: "[0-9]*" }}
    />
  );
};
