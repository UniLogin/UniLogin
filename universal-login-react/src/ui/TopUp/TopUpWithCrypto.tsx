import React, {useEffect, useState} from 'react';
import {QRCode} from 'react-qr-svg';
import {ValueRounder} from '@unilogin/commons';
import {WalletService} from '@unilogin/sdk';
import {classForComponent, useThemeName} from '../utils/classFor';
import {Label} from '../commons/Form/Label';
import {InputCopy} from '../commons/Form/InputCopy';
import {InfoText} from '../commons/Text/InfoText';
import {IncomingTransactionsView} from './IncomingTransactionsView';
import {ThemedComponent} from '../commons/ThemedComponent';

interface TopUpWithCryptoProps {
  walletService: WalletService;
}

const DeploymentWithCryptoInfo = ({minimalAmount, topUpCurrency}: {minimalAmount?: string, topUpCurrency?: string}) =>
  <>
    <InfoText>Send at least {minimalAmount ? ValueRounder.ceil(minimalAmount, 2) : '...'} {topUpCurrency || '...'} to this address</InfoText>
    <InfoText>This screen will update itself as soon as we detect a mined transaction</InfoText>
  </>;

const TopUpCryptoInfo = () =>
  <>
    <InfoText>All your Ethereum tokens have the same address</InfoText>
    <InfoText>Only send Ethereum tokens to this address</InfoText>
  </>;

export const TopUpWithCrypto = ({walletService}: TopUpWithCryptoProps) => {
  const [cryptoClass, setCryptoClass] = useState('');
  const contractAddress = walletService.getContractAddress();
  const [isQrCodeVisible, setIsQrCodeVisible] = useState(false);
  const theme = useThemeName();
  useEffect(() => {
    setCryptoClass('crypto-selected');
  }, []);

  return (
    <ThemedComponent name="top-up">
      <div className={classForComponent('top-up-body-crypto')}>
        <div className={classForComponent('top-up-body')}>
          <div className={classForComponent('top-up-body-inner')}>
            <div className={`crypto ${cryptoClass}`}>
              <Label htmlFor="input-address">Send to</Label>
              <div className={classForComponent('top-up-row')}>
                <InputCopy
                  id="contract-address"
                  defaultValue={contractAddress}
                  readOnly
                />
                <button
                  onClick={() => setIsQrCodeVisible(!isQrCodeVisible)}
                  className={classForComponent('top-up-qr-toggler')}
                />
              </div>

              {(isQrCodeVisible || theme === 'default' || theme === 'jarvis') &&
                <div className={classForComponent('qr-code-wrapper')}>
                  <QRCode
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#120839"
                    width={128}
                    height={128}
                    value={contractAddress}
                  />
                </div>
              }
              {walletService.isKind('Future')
                ? <DeploymentWithCryptoInfo
                  minimalAmount={walletService.getRequiredDeploymentBalance()}
                  topUpCurrency={walletService.getFutureWallet().getTopUpCurrencySymbol()}
                />
                : <TopUpCryptoInfo/>
              }
              {walletService.isKind('Future') &&
                <IncomingTransactionsView futureWallet={walletService.getFutureWallet()}/>
              }
            </div>
          </div>
        </div>
      </div>
    </ThemedComponent>
  );
};
