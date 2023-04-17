import styled from "@emotion/styled";

export const Container = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-color: black;
`;

export const InputPanel = styled.div`
  position: absolute;
  top: calc(50% - 50px);
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 150px;
  background: #44588e;
  border-radius: 10px;
  pointer-events: all;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > p {
    font-size: 20px;
    color: white;
    text-transform: uppercase;
    margin: 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  }

  & > input {
    border-radius: 5px;
    width: 100%;
    height: 40px;
    border: none;
    outline: none;
    font-size: 16px;
    box-sizing: border-box;
    background-color: #90a1d0;
    padding: 10px;
    &:hover {
      border: 1px solid #535c75;
    }
  }

  & > button {
    display: flex;
  }
`;
