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
  height: 220px;
  background: #44588e;
  border-radius: 10px;
  pointer-events: all;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: start;

  & > p {
    font-size: 20px;
    color: white;
    text-transform: uppercase;
    margin: 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  }

  & > input {
    margin-top: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    width: 100%;
    height: 40px;
    border: none;
    outline: none;
    font-size: 16px;
    box-sizing: border-box;
    background-color: #90a1d0;
    padding: 10px;
  }

  & > select {
    margin-top: 10px;
    border-radius: 5px;
    width: 100%;
    height: 40px;
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    outline: none;
    border: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: #90a1d0
      url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24" id="arrow-drop-down"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M7 10l5 5 5-5H7z"></path></svg>')
      no-repeat 30px;
    background-position-x: calc(100% - 5px);
    background-position-y: center;
  }

  & > button {
    margin-top: 10px;
    display: flex;
  }
`;
