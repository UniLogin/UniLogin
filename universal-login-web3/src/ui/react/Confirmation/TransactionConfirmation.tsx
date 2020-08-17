import React, {useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components';
import {utils} from 'ethers';
import {Message, GasParameters, PartialRequired, TokenDetails} from '@unilogin/commons';
import {ModalWrapper, useAsync, GasPrice, getTransactionInfo, useClassFor} from '@unilogin/react';
import {WalletService, getValueInUsd} from '@unilogin/sdk';
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
import {ConfirmationResponse} from '../../../models/ConfirmationResponse';

export interface ConfirmationTransactionProps {
  title: string;
  message: string;
  onConfirmationResponse: (response: ConfirmationResponse) => void;
  walletService: WalletService;
  transaction: PartialRequired<Message, 'to' | 'from' | 'gasLimit' | 'value'>;
  onError?: (errorMessage: string) => void;
}

export const TransactionConfirmation = ({onConfirmationResponse, title, message, walletService, transaction, onError}: ConfirmationTransactionProps) => {
  const [transferDetails] = useAsync<{tokenDetails: TokenDetails, value: string, targetAddress: string}>(() => getTransactionInfo(walletService.getDeployedWallet(), transaction) as any, []);

  const [valueInUSD] = useAsync<any>(async () =>
    transferDetails && getValueInUsd(transferDetails.tokenDetails.address, walletService, transferDetails.value),
  [transferDetails]);

  const [gasParameters, setGasParameters] = useState<GasParameters | undefined>(undefined);

  return <>
    <GlobalStyle />
    <TransactionGlobalStyles />
    <ModalWrapper message={message}>
      <Box className={useClassFor('transaction-confirmation')}>
        <BoxHeader>
          <UniLoginLogo />
          <CloseButton onClick={() => onConfirmationResponse({isConfirmed: false})} />
        </BoxHeader>
        <BoxContent>
          <Title className="confirmation-title">{title}</Title>
          <TransactionData>
            <Row>
              <DataLabel>Send to:</DataLabel>
              <Address>{transferDetails?.targetAddress}</Address>
            </Row>
            <Row>
              <DataLabel>Value:</DataLabel>
              <ValueRow>
                <Highlighted>
                  <Value>{transferDetails && utils.formatUnits(transferDetails.value, transferDetails.tokenDetails.decimals)} {transferDetails?.tokenDetails.symbol}</Value>
                </Highlighted>
                <Value>{valueInUSD} USD</Value>
              </ValueRow>
            </Row>
            <GasPrice
              isDeployed={true}
              deployedWallet={walletService.getDeployedWallet()}
              sdk={walletService.sdk}
              gasLimit={transaction.gasLimit}
              onGasParametersChanged={setGasParameters}
            />
          </TransactionData>
        </BoxContent>
        <BoxFooter>
          <ButtonSecondary onClick={() => onConfirmationResponse({isConfirmed: false})}>Back</ButtonSecondary>
          {gasParameters &&
            <ButtonPrimary onClick={() => onConfirmationResponse({
              isConfirmed: true,
              gasParameters,
            })}>Confirm</ButtonPrimary>
          }
        </BoxFooter>
      </Box>
    </ModalWrapper>
  </>;
};

const TransactionGlobalStyles = createGlobalStyle`
  .unilogin-component-transaction-confirmation.unilogin-theme-unilogin .unilogin-component-gas-price.unilogin-theme-unilogin {
    display: flex;
    align-items: start;
  }
  .unilogin-component-transaction-confirmation.unilogin-theme-unilogin .gas-price-selector {
    top: 324px;

  }
  .unilogin-component-transaction-confirmation.unilogin-theme-unilogin .gas-price-dropdown {
    margin-top: unset;
    margin-left: 46px;
    width: 100%;
  }
  .unilogin-component-transaction-confirmation.unilogin-theme-unilogin .gas-price-title {
    text-transform: capitalize;
    font-size: 14px;
    opacity: 1;
    color: #7D7C9C;
  }
  .unilogin-component-transaction-confirmation.unilogin-theme-unilogin .gas-price-hint {
    margin-top: 1px;
  }
`;

const TransactionData = styled.div`
    margin-top: 45px;

  @media(max-width: 600px) {
        margin - top: 24px;
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
