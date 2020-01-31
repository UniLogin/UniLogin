import React, {useState, useEffect} from 'react';
import {GasMode, findGasMode, findGasOption, GasOption, EMPTY_GAS_OPTION, FAST_GAS_MODE_INDEX, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {ModalWrapper, useAsync, Spinner} from '@universal-login/react';
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
import {ConfirmationResponse} from '../../../models/ConfirmationResponse';

export interface ConfirmationProps {
  title: string;
  message: string;
  onConfirmationResponse: (response: ConfirmationResponse) => void;
  walletService: WalletService;
}

export const Confirmation = ({onConfirmationResponse, title, message, walletService}: ConfirmationProps) => {
  const [gasModes] = useAsync<GasMode[]>(() => walletService.sdk.getGasModes(), []);

  const [mode, setMode] = useState<Pick<GasMode, 'name' | 'usdAmount'>>({name: '', usdAmount: ''});
  const [gasOption, setGasOption] = useState<GasOption>(EMPTY_GAS_OPTION);

  const onModeChanged = (name: string) => {
    const gasTokenAddress = gasOption.token.address;
    const {usdAmount, gasOptions} = findGasMode(gasModes!, name);

    setMode({name, usdAmount});
    setGasOption(findGasOption(gasOptions, gasTokenAddress));
  };

  useEffect(() => {
    if (gasModes) {
      const {name, usdAmount} = gasModes[FAST_GAS_MODE_INDEX];
      const gasOption = findGasOption(gasModes[FAST_GAS_MODE_INDEX].gasOptions, ETHER_NATIVE_TOKEN.address);
      setMode({name, usdAmount});
      setGasOption(gasOption);
    }
  }, [gasModes]);

  return gasModes ? (
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
                <Address>0x67ABC896789DB67890DEF5678EF5678A</Address>
              </Row>
              <Row>
                <DataLabel>Value:</DataLabel>
                <ValueRow>
                  <Highlighted>
                    <Value>{gasOption.gasPrice.toString} ETH</Value>
                  </Highlighted>
                  <Value>{mode.usdAmount}</Value>
                </ValueRow>
              </Row>
              <Row>
                <DataLabel>Speed:</DataLabel>
                <TransactionSpeed gasModes={gasModes} selectedValue={mode.name} onChange={onModeChanged} />
              </Row>
              <Row>
                <DataLabel>Fee:</DataLabel>
                <TransactionFee />
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
