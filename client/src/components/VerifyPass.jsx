/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import QrScanner from 'react-qr-scanner';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90vh;
`;

const Button = styled.button`
  margin: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

const VerifyPass = () => {
  const [scanning, setScanning] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const handleScan = (data) => {
    if (data) {
      isUserPassValid(data);
      setScanning(false);
    }
  };

  const handleError = (error) => {
    console.error('Error accessing camera:', error);
  };

  const handleScanButtonClick = () => {
    setScanning(true);
    startTimer();
  };

  const handleScanAgainButtonClick = () => {
    setScanning(true);
    startTimer();
  };

  const isUserPassValid = async (qrData) => {
    try {
      const res = await fetch(
        `/admin/check`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ busId: qrData }),
          credentials: 'include',
        }
      );
      const data = await res.json();

      if (data.error) {
        return toast.error(data.error);
      }
      toast.success(data.msg);
    } catch (error) {
      console.log(error);
    }
  };

  const startTimer = () => {
    setTimerId(
      setTimeout(() => {
        toast.error('Please try again with valid QR');
        setScanning(false);
      }, 10000)
    );
  };

  const resetTimer = () => {
    clearTimeout(timerId);
    setTimerId(null);
  };

  useEffect(() => {
    if (scanning) {
      startTimer();
    } else {
      resetTimer();
    }

    return () => resetTimer();
  }, [scanning]);

  return (
    <Container>
      {scanning ? (
        <QrScanner
          delay={3}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '300px', height: '300px' }}
        />
      ) : (
        <video
          style={{ width: '300px', height: '300px' }}
          playsInline
          autoPlay
          muted
        />
      )}
      {scanning ? (
        <Button onClick={() => setScanning(false)}>Stop Scan</Button>
      ) : (
        <Button onClick={handleScanButtonClick}>Scan Now</Button>
      )}
      <Button onClick={handleScanAgainButtonClick}>Scan Again</Button>
    </Container>
  );
};

export default VerifyPass;
