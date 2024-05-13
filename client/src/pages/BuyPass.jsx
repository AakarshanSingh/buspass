/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components';
import { DestinationCard, Loader } from '../components';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const JourneyForm = styled.form`
  display: block;
  margin: auto;
  width: 80%;
  background-color: #ffffff;
  border-radius: var(--borderRadius);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 3px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem 2.5rem;
  margin: 3rem auto;
  transition: 0.3s ease-in-out all;
  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  h4 {
    margin-left: 8px;
  }
`;
const JourneyInput = styled.input`
  margin: 0 8px;
  width: 45%;
  height: 2.5rem;
  border: 0.1px solid gainsboro;
  padding-left: 10px;
  border-radius: 4px;
  color: #767676;
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
  margin-top: 1rem;
  padding: 12px;
`;
const BusPass = styled.div`
  display: block;
  margin: auto;
  width: 80%;
`;

const BuyPass = () => {
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');

  const [loading, setLoading] = useState(false);

  const [allBuses, setAllBuses] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/buses`, {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          to,
          from,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAllBuses(data);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <>
      <JourneyForm action="">
        <h4>Book Pass</h4>
        <JourneyInput
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <JourneyInput
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <JourneyButton type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader /> : 'Find My Journey'}
        </JourneyButton>
      </JourneyForm>
      <BusPass>
        <DestinationCard allBuses={allBuses} />
      </BusPass>
    </>
  );
};
export default BuyPass;
