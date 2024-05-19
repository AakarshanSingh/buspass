import jsQR from 'jsqr';

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
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
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleScan = (data) => {
    if (data) {
      console.log(data);
      isUserPassValid(data);
      setScanning(false);
    }
  };

  const handleError = (error) => {
    console.error('Error accessing camera:', error);
  };

  const handleScanButtonClick = () => {
    setScanning(true);
    startVideo();
  };

  const handleScanAgainButtonClick = () => {
    setScanning(true);
    startVideo();
  };

  const isUserPassValid = async (qrData) => {
    try {
      const res = await fetch(`/api/admin/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busId: qrData }),
        credentials: 'include',
      });
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

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => handleError(err));
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    processQRCode(imageData);
  };

  const processQRCode = (imageData) => {
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      handleScan(code.data);
    }
  };

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(captureImage, 1000);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  return (
    <Container>
      {scanning ? (
        <video
          ref={videoRef}
          style={{ width: '300px', height: '300px' }}
          playsInline
          autoPlay
          muted
        />
      ) : (
        <video
          style={{ width: '300px', height: '300px' }}
          playsInline
          autoPlay
          muted
        />
      )}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        width="300"
        height="300"
      ></canvas>
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
