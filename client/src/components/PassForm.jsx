import styled from 'styled-components';
const JourneyForm = styled.form`
  position: absolute;
  left: 50%;
  top: 58%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 40px 30px;
  width: 780px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  border-radius: 6px;
`;
const JourneyInput = styled.input`
  margin: 0 8px;
  width: 35%;
  height: 2.5rem;
  border: 0.1px solid gainsboro;
  padding-left: 10px;
  border-radius: 4px;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: rgba(255, 196, 201, 0.318);
  }
`;

const JourneyButton = styled.button`
  border: none;
  cursor: pointer;
  width: 170px;
  color: white;
  background-color: rgb(221, 20, 50);
  border-radius: 4px;
  margin-left: 0.5rem;
  padding: 12px;
`;

const PassForm = () => {
  return (
    <>
      <JourneyForm action="">
        <JourneyInput type="text" placeholder="From" />
        <JourneyInput type="text" placeholder="To" />
        <JourneyButton type="submit">Find My Journey</JourneyButton>
      </JourneyForm>
    </>
  );
};
export default PassForm;
