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
import {Notice} from '../common/Notice';

export interface ConfirmationProps {
  title: string;
  message: string;
  onConfirmationResponse: (response: boolean) => void;
}

export const Confirmation = ({onConfirmationResponse, title, message}: ConfirmationProps) => {
  const [speed, setSpeed] = useState('slow');

  return (
    <>
      <GlobalStyle/>
      <ModalWrapper>
        <Box className="confirmation-box">
          <BoxHeader>
            <UniLoginLogo />
            <CloseButton />
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
        <Notice message={message} />
      </ModalWrapper>
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  .modal-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 770px !important;
    width: 100%;
  }
  .modal {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background: #ffffff !important;
  }
`;

const Box = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 770px;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 8px;
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
`;

const BoxFooter = styled.div`
  padding: 0 30px 24px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-grow: 1;

  & ${ButtonPrimary} {
    margin-left: 8px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  & > * {
    width: 100%;
  }
`;

const TransactionData = styled.div`
  margin-top: 45px;
`;

const DataLabel = styled(Text)`
  line-height: 17px;
  width: 100px;
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
