import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {utils} from 'ethers';
import {GasMode, GasModesWithPrices, findGasMode, findGasOption, GasOption, EMPTY_GAS_OPTION, FAST_GAS_MODE_INDEX, ETHER_NATIVE_TOKEN, Message, ensureNotFalsy} from '@unilogin/commons';
import {ModalWrapper, useAsync, Spinner} from '@unilogin/react';
import {WalletService} from '@unilogin/sdk';
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
import {ConfirmationResponse} from '../../../models/ConfirmationResponse';

export interface ConfirmationTransactionProps {
  title: string;
  message: string;
  onConfirmationResponse: (response: ConfirmationResponse) => void;
  walletService: WalletService;
  transaction: Partial<Message>;
}

export const TransactionConfirmation = ({onConfirmationResponse, title, message, walletService, transaction}: ConfirmationTransactionProps) => {
  ensureNotFalsy(transaction.value, Error, 'Missing parameter of Transaction: value');
  ensureNotFalsy(transaction.gasLimit, Error, 'Missing parameter of Transaction: gasLimit');
  const [modesAndPrices] = useAsync<GasModesWithPrices>(() => walletService.sdk.gasModeService.getModesWithPrices(), []);
  const [mode, setMode] = useState<Pick<GasMode, 'name' | 'usdAmount'>>({name: '', usdAmount: '0'});

  const [gasOption, setGasOption] = useState<GasOption>(EMPTY_GAS_OPTION);

  const onModeChanged = (name: string) => {
    const gasTokenAddress = gasOption.token.address;
    const {usdAmount, gasOptions} = findGasMode(modesAndPrices?.modes!, name);

    setMode({name, usdAmount});
    setGasOption(findGasOption(gasOptions, gasTokenAddress));
  };

  useEffect(() => {
    if (modesAndPrices) {
      const {name, usdAmount} = modesAndPrices.modes[FAST_GAS_MODE_INDEX];
      const gasOption = findGasOption(modesAndPrices.modes[FAST_GAS_MODE_INDEX].gasOptions, ETHER_NATIVE_TOKEN.address);
      setMode({name, usdAmount});
      setGasOption(gasOption);
    }
  }, [modesAndPrices]);

  return modesAndPrices ? (
    <>
      <GlobalStyle />
      <ModalWrapper message={message}>
        <Box>
          <BoxHeader>
            <UniLoginLogo />
            <CloseButton onClick={() => onConfirmationResponse({isConfirmed: false})} />
          </BoxHeader>
          <BoxContent>
            <Title className="confirmation-title">{title}</Title>
            <TransactionData>
              <Row>
                <DataLabel>Send to:</DataLabel>
                <Address>{transaction.to}</Address>
              </Row>
              <Row>
                <DataLabel>Value:</DataLabel>
                <ValueRow>
                  <Highlighted>
                    <Value>{utils.formatEther(transaction.value)} ETH</Value>
                  </Highlighted>
                  <Value>{walletService.sdk.gasModeService.getCurrencyAmount(utils.bigNumberify(transaction.value), 'USD', modesAndPrices.prices)} USD</Value>
                </ValueRow>
              </Row>
              <Row>
                <DataLabel>Speed:</DataLabel>
                <TransactionSpeed gasModes={modesAndPrices.modes} selectedValue={mode.name} onChange={onModeChanged} />
              </Row>
              <Row>
                <DataLabel>Fee:</DataLabel>
                <TransactionFee mode={mode} gasLimit={transaction.gasLimit} gasOption={gasOption}/>
              </Row>
            </TransactionData>
          </BoxContent>
          <BoxFooter>
            <ButtonSecondary onClick={() => onConfirmationResponse({isConfirmed: false})}>Back</ButtonSecondary>
            <ButtonPrimary onClick={() => onConfirmationResponse({
              isConfirmed: true,
              gasParameters: {
                gasPrice: gasOption.gasPrice,
                gasToken: gasOption.token.address,
              },
            })}>Confirm</ButtonPrimary>
          </BoxFooter>
        </Box>
      </ModalWrapper>
    </>
  ) : <Spinner />;
};

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
