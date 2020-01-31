import React, {useState} from 'react';
import {ModalWrapper} from '@universal-login/react';
import {WalletService} from '@universal-login/sdk';
import styled from 'styled-components';
import {Title} from '../common/Text/Title';
import {Text} from '../common/Text/Text';
import {CloseButton} from '../common/Button/CloseButton';
import {TransactionSpeed} from './TransactionSpeed';
import {TransactionFee} from './TransactionFee';
import {ButtonPrimary, ButtonSecondary} from '../common/Button/Button';
import {UniLoginLogo} from '../common/UniLoginLogo';
import {GlobalStyle} from '../common/GlobalStyle';
import {BoxHeader} from '../common/Layout/BoxHeader';
import {BoxContent} from '../common/Layout/BoxContent';
import {BoxFooter} from '../common/Layout/BoxFooter';
import {Box} from '../common/Layout/Box';
import {Row} from '../common/Layout/Row';

export interface ConfirmationProps {
  title: string;
  message: string;
  onConfirmationResponse: (response: boolean) => void;
  walletService: WalletService;
}

export const Confirmation = ({onConfirmationResponse, title, message}: ConfirmationProps) => {
  const [speed, setSpeed] = useState('cheap');

  return (
    <>
      <GlobalStyle/>
      <ModalWrapper message={message}>
        <Box>
          <BoxHeader>
            <UniLoginLogo />
            <CloseButton onClick={() => onConfirmationResponse(false)} />
          </BoxHeader>
          <BoxContent>
            <Title className="confirmation-title">{title}</Title>
            <TransactionData>
              <Row>
                <DataLabel>Send to:</DataLabel>
                <Address>0x67ABC896789DB67890DEF5678EF5678A</Address>
              </Row>
              <Row>
                <DataLabel>Value:</DataLabel>
                <ValueRow>
                  <Highlighted>
                    <Value>5.5 ETH</Value>
                  </Highlighted>
                  <Value>12345 USD</Value>
                </ValueRow>
              </Row>
              <Row>
                <DataLabel>Speed:</DataLabel>
                <TransactionSpeed selectedValue={speed} onChange={setSpeed} />
              </Row>
              <Row>
                <DataLabel>Fee:</DataLabel>
                <TransactionFee />
              </Row>
            </TransactionData>
          </BoxContent>
          <BoxFooter>
            <ButtonSecondary onClick={() => onConfirmationResponse(false)}>Back</ButtonSecondary>
            <ButtonPrimary onClick={() => onConfirmationResponse(true)}>Confirm</ButtonPrimary>
          </BoxFooter>
        </Box>
      </ModalWrapper>
    </>
  );
};

const TransactionData = styled.div`
  margin-top: 45px;

  @media(max-width: 600px) {
    margin-top: 24px;
  }
`;

const DataLabel = styled(Text)`
  line-height: 17px;
  width: 100px;

  @media(max-width: 600px) {
    width: auto;
    margin-bottom: 4px;
  }
`;

const Address = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  color: #0F0C4A;
`;

const ValueRow = styled.div`
  display: flex;
  align-items: center;
`;

const Value = styled(Text)`
  line-height: 17px;
`;

const Highlighted = styled.div`
  padding: 4px 8px;
  background: #E8F9FE;
  margin-right: 24px;
  border-radius: 4px;

  & ${Value} {
    color: #0F0C4A;
    font-weight: 500;
  }
`;
