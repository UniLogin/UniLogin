import React, {useState, useEffect} from 'react';
import {WalletService} from '@unilogin/sdk';
import {LogoColor} from './FiatPaymentMethods';
import {TopUpProvider} from '../../../core/models/TopUpProvider';
import {TopUpDetails} from './TopUpDetails';
import {Ramp} from '../OnRamp/Ramp';
import {stringToEther} from '@unilogin/commons';
import {ThemedComponent} from '../../commons/ThemedComponent';
import {Wyre} from '../OnRamp/Wyre';
import {Safello} from '../OnRamp/Safello';
import {WaitingForOnRampProvider} from './WaitingForOnRampProvider';
import Spinner from '../../commons/Spinner';

export interface TopUpWithFiatProps {
  walletService: WalletService;
  logoColor?: LogoColor;
  modalClassName?: string;
  setHeaderVisible: (isVisible: boolean) => void;
}
type TopUpWithFiatModal = 'none' | 'wait' | TopUpProvider;

export const TopUpWithFiat = ({setHeaderVisible, walletService, modalClassName, logoColor}: TopUpWithFiatProps) => {
  const [modal, setModal] = useState<TopUpWithFiatModal>('none');
  const [amount, setAmount] = useState('');
  const contractAddress = walletService.getContractAddress();
  const relayerConfig = walletService.sdk.getRelayerConfig();
  const [paymentMethod, setPaymentMethod] = useState<TopUpProvider | undefined>(undefined);

  const onPayClick = (provider: TopUpProvider) => {
    setModal(provider);
  };

  useEffect(() => {
    setHeaderVisible(modal === 'none');
  }, [modal]);

  if (!relayerConfig) {
    return <Spinner />;
  };

  switch (modal) {
    case 'none':
      return (
        <>
          <ThemedComponent name="top-up">
            <TopUpDetails
              walletService={walletService}
              amount={amount}
              onAmountChange={setAmount}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              logoColor={logoColor}
              onPayClick={onPayClick}
            />
          </ThemedComponent>
        </>
      );
    case TopUpProvider.RAMP:
      return <Ramp
        address={contractAddress}
        amount={stringToEther(amount)}
        currency={'ETH'}
        config={relayerConfig.onRampProviders.ramp}
        onSuccess={() => setModal('wait')}
        onCancel={() => setModal('none')}
      />;
    case TopUpProvider.WYRE:
      return <Wyre
        address={contractAddress}
        currency={'ETH'}
        config={relayerConfig.onRampProviders.wyre}
      />;
    case TopUpProvider.SAFELLO:
      return <Safello
        localizationConfig={{} as any}
        safelloConfig={relayerConfig.onRampProviders.safello}
        contractAddress={contractAddress}
        crypto="eth"
      />;
    case 'wait':
      return <WaitingForOnRampProvider
        onRampProviderName={TopUpProvider.RAMP}
        className={modalClassName}
        logoColor={logoColor}
      />;
    default:
      throw Error(`Invalid modal ${modal}`);
  }
};
