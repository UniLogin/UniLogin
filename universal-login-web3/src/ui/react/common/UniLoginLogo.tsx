import React from 'react';
import styled from 'styled-components';
import UImage from '../../assets/ULogo.svg';

export const UniLoginLogo = () => (
  <Row>
    <Logo src={UImage} alt="unilogin logo"/>
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

  @media only screen and (max-width: 600px) {
    font-size: 14px;
    margin: 0 0 0 12px;
    padding: 4px 12px;
  }

  @media only screen and (max-width: 380px) {
    font-size: 12px;
    margin: 0 0 0 8px;
    padding: 3px 10px;
  }
`;

const Logo = styled.img`
  @media only screen and (max-width: 600px) {
    width: 4rem;
    height: 4rem;
  }

  @media only screen and (max-width: 350px) {
    width: unset;
    height: unset;
  }
`;
