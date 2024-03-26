import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.main`
  text-align: center;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;

const TextStyle = styled.div`
  color: #00be00;
  font-size: 50px;
  font-weight: 600;
`;

const BackHome = styled(Link)`
  text-decoration: none;
  color: black;
  font-size: 30px;
  font-weight: 600;
`;

const PaymentSuccess = () => {
  return (
    <Wrapper>
      <TextStyle>Payment Successful</TextStyle>
      <BackHome to="/dashboard">Back Home</BackHome>
    </Wrapper>
  );
};
export default PaymentSuccess;
