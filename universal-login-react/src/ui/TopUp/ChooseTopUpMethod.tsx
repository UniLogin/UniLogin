import React, {useState} from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {TopUpRadioCrypto, TopUpRadioFiat} from './TopUpRadio';
import {LogoColor, TopUpWithFiat} from './Fiat';
import {TopUpWithCrypto} from './TopUpWithCrypto';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../commons/GasPrice';
import {
  DEPLOYMENT_REFUND,
  ensureNotNull,
  GasParameters,
  MINIMAL_DEPLOYMENT_GAS_LIMIT,
  OnGasParametersChanged,
  safeMultiply,
} from '@universal-login/commons';
import {MissingParameter} from '../../core/utils/errors';
import {TopUpProviderSupportService} from '../../core/services/TopUpProviderSupportService';
import {countries} from '../../core/utils/countries';
import {PayButton} from './PayButton';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {getPayButtonState} from '../../app/TopUp/getPayButtonState';
import {ChooseTopUpMethodWrapper} from './ChooseTopUpMethodWrapper';

export interface ChooseTopUpMethodProps {
  sdk: UniversalLoginSDK;
  contractAddress: string;
  onPayClick: (topUpProvider: TopUpProvider, amount: string) => void;
  topUpClassName?: string;
  logoColor?: LogoColor;
  isDeployment: boolean;
  onGasParametersChanged?: OnGasParametersChanged;
}

export const ChooseTopUpMethod = ({sdk, contractAddress, onPayClick, topUpClassName, logoColor, isDeployment, onGasParametersChanged}: ChooseTopUpMethodProps) => {
  const [gasParameters, setGasParameters] = useState<GasParameters | undefined>(undefined);
  if (isDeployment) {
    ensureNotNull(onGasParametersChanged, MissingParameter, 'onGasParametersChanged');
  }
  const gasParametersChanged = (gasParameters: GasParameters) => {
    setGasParameters(gasParameters);
    onGasParametersChanged!(gasParameters);
  };
  const [topUpMethod, setTopUpMethod] = useState<TopUpMethod>(undefined);
  const minimalAmount = gasParameters && safeMultiply(MINIMAL_DEPLOYMENT_GAS_LIMIT, gasParameters.gasPrice);

  const [topUpProviderSupportService] = useState(() => new TopUpProviderSupportService(countries));

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<TopUpProvider | undefined>(undefined);

  return (
    <ChooseTopUpMethodWrapper className={topUpClassName} topUpMethod={topUpMethod}>
      <div className="top-up-header">
        <div className="top-up-methods">
          <TopUpRadioCrypto
            id="topup-btn-crypto"
            onClick={() => setTopUpMethod('crypto')}
            checked={topUpMethod === 'crypto'}
            name="top-up-method"
            className={`top-up-method ${topUpMethod === 'crypto' ? 'active' : ''}`}
          />
          <TopUpRadioFiat
            id="topup-btn-fiat"
            onClick={() => setTopUpMethod('fiat')}
            checked={topUpMethod === 'fiat'}
            name="top-up-method"
            className={`top-up-method ${topUpMethod === 'fiat' ? 'active' : ''}`}
          />
        </div>
      </div>
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
        {isDeployment && <GasPrice
          isDeployed={false}
          sdk={sdk}
          onGasParametersChanged={gasParametersChanged}
          gasLimit={DEPLOYMENT_REFUND}
          className={topUpClassName}
        />
        }
        <PayButton
          onClick={() => onPayClick(paymentMethod!, amount)}
          state={getPayButtonState(paymentMethod, topUpProviderSupportService, amount, topUpMethod)}
        />
      </FooterSection>}
    </ChooseTopUpMethodWrapper>
  );
};
