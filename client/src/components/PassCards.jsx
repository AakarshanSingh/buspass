import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import Loader from './Loader';

const Wrapper = styled.section`
  display: flex;
  gap: 2rem;
  flex-direction: column;
`;

const PassCard = styled.div`
  background-color: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  & {
    text-transform: capitalize;
  }
`;
const PassRoute = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
`;
const PassRouteValid = styled.div`
  text-align: center;
  p:nth-child(1) {
    color: rgb(224, 50, 76);
    font-weight: 600;
    font-size: 2.2rem;
    padding: 0 1rem;
  }
  p:nth-child(2) {
    font-size: 1.1rem;
  }
  h6 {
    color: #023058;
    padding-top: 10px;
  }
`;
const PassRouteDestination = styled.div`
  h6 {
    color: #023058;
    margin-bottom: 0;
  }
  p {
    font-size: 1rem;
    color: #7b7a7a;
  }
`;
const PassRouteId = styled.div`
  margin-top: 1rem;
  h6 {
    color: #023058;
    margin-bottom: 0;
  }
  p {
    font-size: 1rem;
    color: #7b7a7a;
    text-transform: uppercase;
  }
`;
const PassDetails = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const PassUser = styled.div`
  margin-bottom: 1rem;
  h6 {
    color: #023058;
    margin-bottom: 0;
  }
  p {
    font-size: 1rem;
    color: #7b7a7a;
  }
`;
const NoPassWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  align-items: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 15px 25px;
  background-color: rgb(221, 20, 50);
  color: white;
`;

const DownloadPass = styled.button`
  background-color: rgb(221, 20, 50);
  font-size: 12px;
  padding: 0.55rem 0.75rem;
  color: white;
  border: none;
  margin-top: 1rem;
  margin-bottom: -8px;
  z-index: 1;
`;

const PassCards = () => {
  const [myPasses, setMyPasses] = useState([]);
  const { authUser } = useAppContext();
  const [imageLoadedMap, setImageLoadedMap] = useState({});

  const handleImageLoad = (passId) => {
    setImageLoadedMap((prevState) => ({
      ...prevState,
      [passId]: true,
    }));
  };
  useEffect(() => {
    getMyPass();
  }, []);

  const getMyPass = async () => {
    const token = JSON.parse(localStorage.getItem('buspass')).token;
    if (token) {
      try {
        const response = await fetch(
          `/api/user/get-pass`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        setMyPasses(data.myPasses);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('No token found, user not logged in');
    }
  };

  const handleDownloadPass = async (pass) => {
    // Base color
    const baseColor = 'rgb(221, 20, 50)';

    try {
      // Generating QR code URL
      const qrCodeUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${pass._id}`;

      // Creating HTML representation of the pass with CSS styles and QR code
      const passHtml = `
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 20px;
          }
          .ticket {
            background-color: #fff;
            border-radius: 10px;
            padding: 20px;
            margin: 20px auto;
            max-width: 400px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            color: ${baseColor};
          }
          .ticket h3 {
            margin-top: 0;
            color: ${baseColor};
          }
          .ticket p {
            margin: 5px 0;
            color: #666;
          }
          .ticket hr {
            border: none;
            border-top: 1px dashed #ccc;
            margin: 10px 0;
          }
          .qr-code {
            margin-top: 20px;
            text-align: center;
          }
          .qr-code img {
            width: 150px;
            height: 150px;
          }
        </style>
        <div class="ticket">
          <h3>Bus Pass</h3>
          <p><strong>Name of the Passenger:</strong> ${
            authUser.userDetails.name
          }</p>
          <hr>
          <p><strong>From:</strong> ${pass.from}</p>
          <p><strong>To:</strong> ${pass.to}</p>
          <hr>
          <p><strong>Issued at:</strong> ${new Date(
            pass.createdAt
          ).toLocaleDateString()}</p>
          <p><strong>Valid till:</strong> ${new Date(
            pass.validity
          ).toLocaleDateString()}</p>
          <div class="qr-code">
            <img src="${qrCodeUrl}" alt="QR Code">
          </div>
        </div>
      `;

      // Open a new window with the pass HTML content
      const printWindow = window.open('', '_blank');
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Bus Pass</title>
          </head>
          <body>${passHtml}</body>
        </html>
      `);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
      }, 100);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <Wrapper>
      {myPasses?.length > 0 ? (
        <>
          {myPasses.map((pass) => {
            let date = new Date(pass.validity);
            const dateObject = new Date(date);
            const formattedDate = dateObject.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const dateParts = formattedDate.split(' ');
            const qr = `https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${pass._id}`;
            return (
              <PassCard key={pass._id}>
                <PassRoute>
                  <PassRouteValid>
                    <p>{`${dateParts[1].replace(',', ' ')}`}</p>
                    <p>{`${dateParts[0]} ${dateParts[2]}`}</p>
                    <h6>Valid till </h6>
                  </PassRouteValid>
                  <PassRouteDestination>
                    <PassUser>
                      <h6>Name of the Passenger</h6>
                      <p>{authUser.userDetails.name}</p>
                    </PassUser>
                    <h6>Route</h6>
                    <p>{`${pass.from} - ${pass.to}`}</p>
                    <PassRouteId>
                      <h6>Completed</h6>
                      <p>{`Pass Id : ${pass._id}`}</p>
                    </PassRouteId>
                  </PassRouteDestination>
                  <PassDetails>
                    <DownloadPass onClick={() => handleDownloadPass(pass)}>
                      Download Pass
                    </DownloadPass>
                    {!imageLoadedMap[pass._id] && <Loader></Loader>}
                    <img
                      src={qr}
                      alt=""
                      onLoad={() => handleImageLoad(pass._id)}
                      style={{
                        display: imageLoadedMap[pass._id] ? 'block' : 'none',
                      }}
                    />
                  </PassDetails>
                  {/* <div>
                    <h6>Name of the Passenger</h6>
                    <p>{authUser.userDetails.name}</p>
                  </div>
                  <div>
                    <h6>From</h6>
                    <p>{pass.from}</p>
                  </div>
                  <div>
                    <h6>To</h6>
                    <p>{pass.to}</p>
                  </div> */}
                </PassRoute>
              </PassCard>
            );
          })}
        </>
      ) : (
        <NoPassWrapper>
          <h2>You have no pass</h2>
          <StyledLink to="buy-pass">Buy one pass </StyledLink>
        </NoPassWrapper>
      )}
    </Wrapper>
  );
};
export default PassCards;
