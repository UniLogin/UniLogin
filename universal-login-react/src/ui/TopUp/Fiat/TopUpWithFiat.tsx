import React, {useState, useEffect} from 'react';
import {WalletService} from '@unilogin/sdk';
import {LogoColor} from './FiatPaymentMethods';
import {TopUpProvider} from '../../../core/models/TopUpProvider';
import {TopUpDetails} from './TopUpDetails';
import {Ramp} from '../OnRamp/Ramp';
import {RampConfig, RampOverrides} from '@unilogin/commons';
import {ThemedComponent} from '../../commons/ThemedComponent';
import {Wyre} from '../OnRamp/Wyre';
import {Safello} from '../OnRamp/Safello';
import {WaitingForOnRampProvider} from './WaitingForOnRampProvider';
import Spinner from '../../commons/Spinner';
import {OnRampSuccessInfo} from './OnRampSuccessInfo';
import {formatValue} from '../../../core/utils/formatValue';

export interface TopUpWithFiatProps {
  walletService: WalletService;
  logoColor?: LogoColor;
  setHeaderVisible: (isVisible: boolean) => void;
  hideModal?: () => void;
}
type TopUpWithFiatModal = 'none' | 'wait' | TopUpProvider;

const getRampConfig = (config: RampConfig, rampOverrides?: RampOverrides) => ({...config, ...rampOverrides});

export const TopUpWithFiat = ({hideModal, setHeaderVisible, walletService, logoColor}: TopUpWithFiatProps) => {
  const [modal, setModal] = useState<TopUpWithFiatModal>('none');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<string>('ETH');
  const contractAddress = walletService.getContractAddress();
  const relayerConfig = walletService.sdk.getRelayerConfig();
  const [paymentMethod, setPaymentMethod] = useState<TopUpProvider | undefined>(undefined);

  const onPayClick = (provider: TopUpProvider, currency: string) => {
    setCurrency(currency);
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
        amount={formatValue(walletService.sdk, amount, currency)}
        currency={currency}
        config={getRampConfig(relayerConfig.onRampProviders.ramp, walletService.sdk.config.rampOverrides)}
        onSuccess={() => setModal('wait')}
        onCancel={() => setModal('none')}
      />;
    case TopUpProvider.WYRE:
      return (
        <>
          <Wyre
            address={contractAddress}
            currency={currency}
            config={relayerConfig.onRampProviders.wyre}
            onBack={() => setModal('none')}
            isDeployed={walletService.isDeployed()}
          />
        </>);
    case TopUpProvider.SAFELLO:
      return <Safello
        localizationConfig={{} as any}
        safelloConfig={relayerConfig.onRampProviders.safello}
        contractAddress={contractAddress}
        crypto="eth"
      />;
    case 'wait':
      return walletService.isDeployed()
        ? <OnRampSuccessInfo
          onRampProvider={paymentMethod!}
          amount={amount}
          currency={currency}
          hideModal={hideModal}
        />
        : <WaitingForOnRampProvider
          onRampProviderName={paymentMethod!}
          logoColor={logoColor}
        />;
    default:
      throw Error(`Invalid modal ${modal}`);
  }
};
