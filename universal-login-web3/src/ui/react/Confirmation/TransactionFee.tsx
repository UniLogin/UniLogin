import React from 'react';
import styled from 'styled-components';
import ethereumIcon from '../../assets/ethereum.svg';
import {Text} from '../common/Text/Text';

export const TransactionFee = () => (
  <FeeBlock>
    <Logo src={ethereumIcon} alt="ethereum logo"/>
    <FeeRow>
      <div>
        <FeeAmount>0.098729 ETH</FeeAmount>
        <FeeText>= 1 USD</FeeText>
      </div>
      <div>
        <Text>Your balance</Text>
        <FeeText>0.00736 ETH </FeeText>
      </div>
    </FeeRow>
  </FeeBlock>
);

const FeeBlock = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 14px 10px 12px;
  box-sizing: border-box;
  background: #F3FCFF;
  border: 1px solid #BDE6F2;
  border-radius: 4px;
`;

const Logo = styled.img`
  display: block;
  width: 24px;
  margin-right: 8px;
`;

const FeeRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const FeeAmount = styled.p`
  margin: 0 0 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #0F0C4A;
`;

const FeeText = styled.p`
  margin: 0;
  font-size: 10px;
  line-height: 12px;
  color: #0F0C4A;
  opacity: 0.5;
`;
