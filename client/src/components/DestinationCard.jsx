/* eslint-disable no-async-promise-executor */
/* eslint-disable react/prop-types */
import styled from 'styled-components';
import Loader from './Loader';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const CardContainer = styled.div`
  margin-top: 10px;
  background-color: #ffffff;
  padding: 40px 20px;
  width: 800px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
`;
const ServiceProvider = styled.div`
  p:nth-child(1) {
    font-size: 18px;
    color: #5e6fa2;
    font-weight: 600;
    padding: 5px 0;
  }
  & {
    font-size: 16px;
  }
  span {
    font-weight: 500;
  }
`;
const ServiceProviderDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  color: #000000;
  gap: 1rem;
  button {
    border: none;
    cursor: pointer;
    width: 120px;
    color: white;
    background-color: rgb(221, 20, 50);
    border-radius: 4px;
    padding: 8px 5px;
    margin-top: 1rem;
  }
`;
const JourneyCardDescription = styled.div`
  display: grid;
  width: 800px;
  grid-template-columns: 1fr 1fr;
  background-color: #ffffff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  padding: 16px 20px;
  color: #676f82;
  border-radius: 6px;
`;
const JourneyCardTitle = styled.div`
  text-transform: capitalize;
  font-size: 16px;
`;
const JourneyCardDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  color: #676f82;
  gap: 1rem;
`;
const Wrapper = styled.div`
  /* styles.css */
  .popup-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popup-modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
  }

  .popup-modal-content img {
    max-width: 100%;
  }

  .popup-modal-content button {
    margin-top: 20px;
    padding: 8px 16px;
    border: none;
    background-color: #dc3545;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    margin: 10px;
  }

  .popup-modal-content button:hover {
    background-color: #c82333;
  }
`;

const DestinationCard = ({ allBuses }) => {
  const BTC_QR = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${
    import.meta.env.VITE_BTC_ADDRESS
  }`;

  const { authUser } = useAppContext();
  const buses = allBuses?.buses;

  const [showQR, setShowQR] = useState(false);

  const [price, setPrice] = useState();
  const [selectedBus, setSelectedBus] = useState();

  const navigate = useNavigate();

  const buyWithCrypto = async (busId, busPrice) => {
    if (!authUser) {
      setTimeout(() => navigate('/auth'), 500);
      toast.error('Please login first');
      return false;
    }
    setSelectedBus(busId);
    try {
      // const response = await fetch(
      //   'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr'
      // );
      // const btcPriceInr = await response.json();
      // const currentBtc = btcPriceInr.bitcoin.inr;
      // const btcAmount = busPrice / currentBtc;
      const btcAmount = busPrice / 5724755.04;
      setPrice(btcAmount.toFixed(8));
      setShowQR(true);
    } catch (error) {
      console.error('Error fetching BTC price:', error);
    }
  };
  const closeQRModal = () => {
    setShowQR(false);
  };

  const checkBTCPayment = async (e) => {
    e.preventDefault();
    try {
      // Show loading toast
      const loadingToast = toast.loading('Processing payment...');
      const token = JSON.parse(localStorage.getItem('buspass')).token;
      const res = await fetch(`/api/user/book-crypto`, {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price,
          busId: selectedBus,
        }),
      });
      const data = await res.json();

      toast.dismiss(loadingToast);

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const checkPaymentPromise = new Promise(async (resolve, reject) => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          resolve({ success: true });
        } catch (error) {
          reject(error);
        }
      });

      const result = await Promise.race([
        checkPaymentPromise,
        new Promise((resolve) => setTimeout(resolve, 5000, { timeout: true })),
      ]);

      if (result.success) {
        toast.success('Payment successful');
        setShowQR(false);
        setTimeout(() => navigate('/auth'), 500);
      } else {
        toast.error('Payment error');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while processing payment');
    }
  };

  const buyWithCard = async (busId) => {
    if (!authUser) {
      setTimeout(() => navigate('/auth'), 500);
      toast.error('Please login first');
      return false;
    }
    try {
      const stripe_key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      const stripe = await loadStripe(stripe_key);
      const token = JSON.parse(localStorage.getItem('buspass')).token;
      const res = await fetch(`/api/user/book`, {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          busId,
        }),
      });
      const session = await res.json();

      const result = stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!allBuses) {
    return <Loader />;
  }

  return (
    <Wrapper>
      {buses?.length > 0 ? (
        <form>
          {showQR && (
            <div className="popup-modal">
              <div className="popup-modal-content">
                <img src={BTC_QR} alt="Bitcoin QR Code" />
                <p>Pay {price} BTC</p>
                <p>BTC Address</p>
                <p>{import.meta.env.VITE_BTC_ADDRESS}</p>
                <div>
                  <button onClick={checkBTCPayment}>Done</button>
                  <button onClick={closeQRModal}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          <JourneyCardDescription>
            <JourneyCardTitle>Service Provider</JourneyCardTitle>
            <JourneyCardDetails>
              <p>Dep Time</p>
              <p>Arr time</p>
              <p>Fare</p>
            </JourneyCardDetails>
          </JourneyCardDescription>
          {buses.map((item) => {
            return (
              <>
                <CardContainer key={item?._id}>
                  <ServiceProvider>
                    <p>{item?.name}</p>
                    <p>
                      <span>Route : </span>
                      {`${item?.from} to ${item?.to}`}
                    </p>
                    <p>
                      <span>Boarding Point : </span>
                      {item?.boardingPoint}
                    </p>
                  </ServiceProvider>
                  <ServiceProviderDetails>
                    <p>{item?.departureTime}</p>
                    <p>{item?.arrivalTime}</p>
                    <p>
                      {`₹ ${item?.price}`}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          buyWithCard(item._id);
                        }}
                      >
                        Buy with Card
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          buyWithCrypto(item._id, item.price);
                        }}
                      >
                        Buy with Crypto
                      </button>
                    </p>
                  </ServiceProviderDetails>
                </CardContainer>
              </>
            );
          })}
        </form>
      ) : (
        <h1>No Buses are available for your route</h1>
      )}
    </Wrapper>
  );
};

export default DestinationCard;
