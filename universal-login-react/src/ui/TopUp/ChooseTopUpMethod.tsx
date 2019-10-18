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
import {OnGasParametersChanged, DEPLOY_GAS_LIMIT, ensureNotNull} from '@universal-login/commons';
import {MissingParameter} from '../../core/utils/errors';
import {isPrefilledAmountUsedBy} from '../../core/utils/isPrefilledAmountUsedBy';
import {FiatOptions} from '../../core/models/FiatOptions';

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
  if (isDeployment) {
    ensureNotNull(onGasParametersChanged, MissingParameter, 'onGasParametersChanged');
  }
  const [topUpMethod, setTopUpMethod] = useState<'fiat' | 'crypto' | ''>('');
  const methodSelectedClassName = topUpMethod !== '' ? 'method-selected' : '';
  const [fiatOptions, setFiatOptions] = useState<FiatOptions>({
    amount: ''
  });

  const isInputAmountInvalid = isPrefilledAmountUsedBy(fiatOptions.topUpProvider) && Number(fiatOptions.amount) <= 0;
  const isTopUpProviderSelected = !!fiatOptions.topUpProvider;
  const isPayButtonDisabled = topUpMethod !== 'fiat' || !isTopUpProviderSelected || isInputAmountInvalid;

  return (
    <div className="universal-login-topup">
      <div className={`${getStyleForTopLevelComponent(topUpClassName)}`}>
        <div className={`top-up ${methodSelectedClassName}`}>
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
              {topUpMethod === 'crypto' && <TopUpWithCrypto contractAddress={contractAddress} isDeployment={isDeployment} />}
              {topUpMethod === 'fiat' &&
                <TopUpWithFiat
                  fiatOptions={fiatOptions}
                  onFiatOptionsChanged={setFiatOptions}
                  sdk={sdk}
                  logoColor={logoColor}
                />}
            </div>
          </div>


          <FooterSection className={topUpClassName}>
            {isDeployment &&
              <GasPrice
                isDeployed={false}
                sdk={sdk}
                onGasParametersChanged={onGasParametersChanged!}
                gasLimit={DEPLOY_GAS_LIMIT}
                className={topUpClassName}
              />
            }
            <button
              onClick={() => onPayClick(fiatOptions.topUpProvider!, fiatOptions.amount)}
              className="pay-btn"
              disabled={isPayButtonDisabled}
            >
              Pay
            </button>
          </FooterSection>
        </div>
      </div>
    </div>
  );
};
