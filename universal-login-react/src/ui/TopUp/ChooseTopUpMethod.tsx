import React, {useReducer, useState} from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
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
import {topUpReducer} from '../../app/TopUp/reducer';
import {TOP_UP_INITIAL_STATE} from '../../app/TopUp/state';
import {TopUpMethodSelector} from './TopUpMethodSelector';
import {getPayButtonState} from '../../app/TopUp/selectors';

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
  const minimalAmount = gasParameters && safeMultiply(MINIMAL_DEPLOYMENT_GAS_LIMIT, gasParameters.gasPrice);

  const [topUpProviderSupportService] = useState(() => new TopUpProviderSupportService(countries));

  const [state, dispatch] = useReducer(topUpReducer, TOP_UP_INITIAL_STATE);

  return (
    <div className="universal-login-topup">
      <div className={`${getStyleForTopLevelComponent(topUpClassName)}`}>
        <div className={`top-up ${state.method ? 'method-selected' : ''}`}>
          <TopUpMethodSelector value={state.method} onChange={method => dispatch({type: 'SET_METHOD', method})} />
          <div className="top-up-body">
            <div className="top-up-body-inner">
              {state.method === 'crypto' && (
                <TopUpWithCrypto
                  contractAddress={contractAddress}
                  isDeployment={isDeployment}
                  minimalAmount={minimalAmount}
                />
              )}
              {state.method === 'fiat' && (
                <TopUpWithFiat
                  sdk={sdk}
                  topUpProviderSupportService={topUpProviderSupportService}
                  state={state}
                  dispatch={dispatch}
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
              onClick={() => onPayClick(state.provider!, state.amount)}
              state={getPayButtonState(state, topUpProviderSupportService)}
            />
          </FooterSection>
        </div>
      </div>
    </div>
  );
};
