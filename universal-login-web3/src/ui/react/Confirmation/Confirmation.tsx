import React, {useState} from 'react';
import {ModalWrapper} from '@universal-login/react';
import styled, {createGlobalStyle} from 'styled-components';
import {Title} from '../common/Text/Title';
import {Text} from '../common/Text/Text';
import {CloseButton} from '../common/Button/CloseButton';
import {TransactionSpeed} from './TransactionSpeed';
import {TransactionFee} from './TransactionFee';
import {ButtonPrimary, ButtonSecondary} from '../common/Button/Button';
import {UniLoginLogo} from '../common/UniLoginLogo';

export interface ConfirmationProps {
  title: string;
  message: string;
  onConfirmationResponse: (response: boolean) => void;
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

const GlobalStyle = createGlobalStyle`

  .universal-login-default .unilogin-component-modal-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 770px;
    width: 100%;
    min-height: initial;
    max-height: 100%;
    overflow-y: auto;
  }
  .universal-login-default .modal {
    background: #ffffff;
    overflow: visible;
  }
`;

const Box = styled.div`
  position: relative;
  max-width: 770px;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 8px;

  @media(max-width: 600px) {
    min-height: calc(100vh - 41px);
    display: flex;
    flex-direction: column;
    padding: 8px 16px 16px;
    border-radius: 0;
  }
`;

const BoxHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BoxContent = styled.div`
  max-width: 530px;
  width: 100%;
  margin: 0 auto;
  padding: 30px;
  box-sizing: border-box;

  @media(max-width: 600px) {
    padding: 24px 0 0;
  }
`;

const BoxFooter = styled.div`
  padding: 0 30px 24px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 220px;
  flex-grow: 1;

  & ${ButtonPrimary} {
    margin-left: 8px;
  }

  @media(max-width: 600px) {
    justify-content: space-between;
    margin-top: 67px;
    padding: 0;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  & > * {
    width: 100%;
  }

  @media(max-width: 600px) {
    display: block;
    margin-bottom: 24px;
  }
`;

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
