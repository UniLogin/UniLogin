import React, {useState} from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import daiIcon from './../assets/topUp/tokensIcons/DAI.svg';
import EthereumIcon from './../assets/topUp/tokensIcons/ETH.svg';
import cardIcon from './../assets/topUp/card.svg';
import bankIcon from './../assets/topUp/bank.svg';
import {TopUpRadio} from './TopUpRadio';
import {LogoColor, TopUpWithFiat} from './Fiat';
import {TopUpWithCrypto} from './TopUpWithCrypto';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
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
    <div className="universal-login-topup">
      <div className={`${getStyleForTopLevelComponent(topUpClassName)}`}>
        <div className={`top-up ${topUpMethod ? 'method-selected' : ''}`}>
          <div className="top-up-header">
            <h2 className="top-up-title">Choose a top-up method</h2>
            <div className="top-up-methods">
              <TopUpRadio
                id="topup-btn-crypto"
                onClick={() => setTopUpMethod('crypto')}
                checked={topUpMethod === 'crypto'}
                name="top-up-method"
                className={`top-up-method ${topUpMethod === 'crypto' ? 'active' : ''}`}
              >
                <div className="top-up-method-icons">
                  <img className="top-up-method-icon" src={daiIcon} alt="Dai" />
                  <img className="top-up-method-icon" src={EthereumIcon} alt="Ethereum" />
                </div>
                <p className="top-up-method-title">Crypto</p>
                <p className="top-up-method-text">Free-Deposit ETH or DAI</p>
              </TopUpRadio>
              <TopUpRadio
                id="topup-btn-fiat"
                onClick={() => setTopUpMethod('fiat')}
                checked={topUpMethod === 'fiat'}
                name="top-up-method"
                className={`top-up-method ${topUpMethod === 'fiat' ? 'active' : ''}`}
              >
                <div className="top-up-method-icons">
                  <img className="top-up-method-icon" src={cardIcon} alt="card" />
                  <img className="top-up-method-icon" src={bankIcon} alt="Dai" />
                </div>
                <p className="top-up-method-title">Fiat</p>
                <p className="top-up-method-text">Buy using credit card or bank account</p>
              </TopUpRadio>

            </div>
          </div>
          <div className="top-up-body">
            <div className="top-up-body-inner">
              {topUpMethod === 'crypto' && (
                <TopUpWithCrypto
                  contractAddress={contractAddress}
                  isDeployment={isDeployment}
                  minimalAmount={minimalAmount}
                />
              )}
              {topUpMethod === 'fiat' && (
                <TopUpWithFiat
                  sdk={sdk}
                  topUpProviderSupportService={topUpProviderSupportService}
                  amount={amount}
                  onAmountChange={setAmount}
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                  logoColor={logoColor}
                />
              )}
            </div>
          </div>

          <FooterSection className={topUpClassName}>
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
          </FooterSection>
        </div>
      </div>
    </div>
  );
};
