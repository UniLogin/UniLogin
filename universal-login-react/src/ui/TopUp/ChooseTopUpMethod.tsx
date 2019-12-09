import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {LogoColor, TopUpWithFiat} from './Fiat';
import {TopUpWithCrypto} from './TopUpWithCrypto';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../commons/GasPrice';
import {
  DEPLOYMENT_REFUND,
  GasParameters,
} from '@universal-login/commons';
import {TopUpProviderSupportService} from '../../core/services/TopUpProviderSupportService';
import {countries} from '../../core/utils/countries';
import {PayButton} from './PayButton';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {getPayButtonState} from '../../app/TopUp/getPayButtonState';
import {ChooseTopUpMethodWrapper} from './ChooseTopUpMethodWrapper';
import {ChooseTopUpMethodHeader} from './ChooseTopUpMethodHeader';

export interface ChooseTopUpMethodProps {
  sdk: UniversalLoginSDK;
  contractAddress: string;
  onPayClick: (topUpProvider: TopUpProvider, amount: string) => void;
  topUpClassName?: string;
  logoColor?: LogoColor;
  isDeployment: boolean;
  walletService?: WalletService;
}

export const ChooseTopUpMethod = ({sdk, contractAddress, onPayClick, topUpClassName, logoColor, isDeployment, walletService}: ChooseTopUpMethodProps) => {
  const [minimalAmount, setMinimalAmount] = useState(walletService!.getRequiredDeploymentBalance());

  const onGasParametersChanged = (gasParameters: GasParameters) => {
    walletService!.setGasParameters(gasParameters);
    setMinimalAmount(walletService!.getRequiredDeploymentBalance());
  };

  const [topUpMethod, setTopUpMethod] = useState<TopUpMethod>(undefined);

  const [topUpProviderSupportService] = useState(() => new TopUpProviderSupportService(countries));

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<TopUpProvider | undefined>(undefined);

  return (
    <ChooseTopUpMethodWrapper className={topUpClassName} topUpMethod={topUpMethod}>
      <ChooseTopUpMethodHeader
        topUpMethod={topUpMethod}
        setTopUpMethod={setTopUpMethod}
      />
      {topUpMethod === 'crypto' && <TopUpWithCrypto
        contractAddress={contractAddress}
        isDeployment={isDeployment}
        minimalAmount={minimalAmount}
      />}
      {topUpMethod === 'fiat' && <TopUpWithFiat
        sdk={sdk}
        topUpProviderSupportService={topUpProviderSupportService}
        amount={amount}
        onAmountChange={setAmount}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        logoColor={logoColor}
      />}
      {topUpMethod && <FooterSection className={topUpClassName}>
        {isDeployment &&
          <GasPrice
            isDeployed={false}
            sdk={sdk}
            onGasParametersChanged={onGasParametersChanged}
            gasLimit={DEPLOYMENT_REFUND}
            className={topUpClassName}
          />}
        <PayButton
          onClick={() => onPayClick(paymentMethod!, amount)}
          state={getPayButtonState(paymentMethod, topUpProviderSupportService, amount, topUpMethod)}
        />
      </FooterSection>}
    </ChooseTopUpMethodWrapper>
  );
};
