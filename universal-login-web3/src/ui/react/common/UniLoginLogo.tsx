import React from 'react';
import styled from 'styled-components';
import UImage from '../../assets/U.svg';

export const UniLoginLogo = () => (
  <Row>
    <img src={UImage} alt="unilogin logo"/>
    <BetaLabel>BETA</BetaLabel>
  </Row>
);

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const BetaLabel = styled.p`
  margin: 0 0 0 8px;
  padding: 3px 10px;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  color: #439DB0;
  background: #E8F9FE;
  border-radius: 16px;
`;
