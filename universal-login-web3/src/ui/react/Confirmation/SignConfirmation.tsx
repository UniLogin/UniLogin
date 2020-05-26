import React from 'react';
import {ModalWrapper} from '@unilogin/react';
import styled from 'styled-components';
import {Title} from '../common/Text/Title';
import {Text} from '../common/Text/Text';
import {CloseButton} from '../common/Button/CloseButton';
import {ButtonPrimary, ButtonSecondary} from '../common/Button/Button';
import {UniLoginLogo} from '../common/UniLoginLogo';
import {GlobalStyle} from '../common/GlobalStyle';
import {BoxHeader} from '../common/Layout/BoxHeader';
import {BoxContent} from '../common/Layout/BoxContent';
import {BoxFooter} from '../common/Layout/BoxFooter';
import {Box} from '../common/Layout/Box';
import {Row} from '../common/Layout/Row';

export interface SignConfirmationProps {
  title: string;
  message: string;
  signMessage: string;
  onConfirmationResponse: (response: boolean) => void;
}

export const SignConfirmation = ({onConfirmationResponse, title, message, signMessage}: SignConfirmationProps) => (
  <>
    <GlobalStyle />
    <ModalWrapper message={message}>
      <Box>
        <BoxHeader>
          <UniLoginLogo />
          <CloseButton onClick={() => onConfirmationResponse(false)} />
        </BoxHeader>
        <BoxContent>
          <Title className="confirmation-title">{title}</Title>
          <MessageWrapper>
            <Label>message</Label>
            <CentralizedText>{signMessage}</CentralizedText>
          </MessageWrapper>
        </BoxContent>
        <SignFooter>
          <ButtonSecondary onClick={() => onConfirmationResponse(false)}>Back</ButtonSecondary>
          <ButtonPrimary onClick={() => onConfirmationResponse(true)}>Sign</ButtonPrimary>
        </SignFooter>
      </Box>
    </ModalWrapper>
  </>
);

const MessageWrapper = styled(Row)`
  flex-direction: column;
  margin-top: 45px;
`;

const CentralizedText = styled(Text)`
  text-align: center;
  font-size: 16px;
  border: 1px solid rgba(190, 207, 217, 0.6);
  border-radius: 4px;
  padding: 15px;
  overflow: overlay;
  text-overflow: ellipsis;

  @media(max-width: 600px) {
    margin-top: 24px;
  }

`;

const Label = styled.p`
  color: #7D7C9C;
  text-transform: uppercase;
`;

const SignFooter = styled(BoxFooter)`
  margin-bottom: auto;
`;
