import React, {Dispatch, useState} from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {CountryDropdown} from './CountryDropdown';
import {AmountInput} from './AmountInput';
import {FiatFooter} from './FiatFooter';
import {FiatPaymentMethods, LogoColor} from './FiatPaymentMethods';
import {useAsyncEffect} from '../../../ui/hooks/useAsyncEffect';
import {countries} from '../../../core/utils/countries';
import {IPGeolocationService} from '../../../integration/http/IPGeolocationService';
import {TopUpProviderSupportService} from '../../../core/services/TopUpProviderSupportService';
import {TopUpState} from '../../../app/TopUp/state';
import {TopUpAction} from '../../../app/TopUp/actions';

export interface TopUpWithFiatProps {
  sdk: UniversalLoginSDK;
  topUpProviderSupportService: TopUpProviderSupportService;
  state: TopUpState;
  dispatch: Dispatch<TopUpAction>;
  logoColor?: LogoColor;
}

export const TopUpWithFiat = ({sdk, logoColor, topUpProviderSupportService, state, dispatch}: TopUpWithFiatProps) => {
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [currency, setCurrency] = useState('ETH');

  const changeCountry = (newCountry: string) => {
    if (newCountry === country) {
      return;
    }
    const providers = topUpProviderSupportService.getProviders(newCountry);
    dispatch({
      type: 'SET_PROVIDER',
      provider: providers.length === 1 ? providers[0] : undefined,
    });
    setCountry(newCountry);
  };

  async function recognizeUserCountry() {
    const {ipGeolocationApi} = sdk.getRelayerConfig();
    const ipGeolocationService = new IPGeolocationService(ipGeolocationApi.baseUrl, ipGeolocationApi.accessKey);
    const userCountryCode = await ipGeolocationService.getCountryCode().catch(console.error);

    const userCountry = countries.find(({code}) => code === userCountryCode);
    if (country === undefined && userCountry) {
      changeCountry(userCountry.name);
    }
    return () => {};
  }

  useAsyncEffect(recognizeUserCountry, []);

  return (
    <div className="fiat fiat-selected">
      <div className="fiat-inputs">
        <div className="fiat-input-item">
          <p className="top-up-label">Country</p>
          <CountryDropdown
            selectedCountry={country}
            setCountry={changeCountry}
            setCurrency={setCurrency}
          />
        </div>
        {topUpProviderSupportService.isInputAmountUsed(state.provider) &&
          <div className="fiat-input-item">
            <p className="top-up-label">Amount</p>
            <AmountInput
              selectedCurrency={currency}
              setCurrency={setCurrency}
              amount={state.amount}
              onChange={amount => dispatch({type: 'SET_AMOUNT', amount})}
            />
          </div>}
      </div>
      {!!country && <>
        <p className="top-up-label fiat-payment-methods-title">Payment method</p>
        <FiatPaymentMethods
          selectedCountry={country}
          supportService={topUpProviderSupportService}
          paymentMethod={state.provider}
          setPaymentMethod={provider => dispatch({type: 'SET_PROVIDER', provider})}
          logoColor={logoColor}
        />
      </>}
      <div className="fiat-bottom">
        {!!country && <FiatFooter paymentMethod={state.provider} />}
      </div>
    </div>
  );
};
