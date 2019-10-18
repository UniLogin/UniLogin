import React, {useEffect, useState} from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {CountryDropdown} from './CountryDropdown';
import {AmountInput} from './AmountInput';
import {FiatFooter} from './FiatFooter';
import {FiatPaymentMethods, LogoColor} from './FiatPaymentMethods';
import {useAsyncEffect} from '../../../ui/hooks/useAsyncEffect';
import {countries} from '../../../core/utils/countries';
import {TopUpProvider} from '../../../core/models/TopUpProvider';
import {IPGeolocationService} from '../../../integration/http/IPGeolocationService';
import {TopUpProviderSupportService} from '../../../core/services/TopUpProviderSupportService';
import {isPrefilledAmountUsedBy} from '../../../core/utils/isPrefilledAmountUsedBy';
import {FiatOptions} from '../../../core/models/FiatOptions';

export interface TopUpWithFiatProps {
  sdk: UniversalLoginSDK;
  fiatOptions: FiatOptions;
  onFiatOptionsChanged(fiatOptions: FiatOptions): void;
  logoColor?: LogoColor;
}

export const TopUpWithFiat = ({fiatOptions, onFiatOptionsChanged, sdk, logoColor}: TopUpWithFiatProps) => {
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [currency, setCurrency] = useState('ETH');
  const [fiatClass, setFiatClass] = useState('');

  const topUpProviderSupportService = new TopUpProviderSupportService(countries);

  const onTopUpProviderChanged = (topUpProvider?: TopUpProvider) => onFiatOptionsChanged({...fiatOptions, topUpProvider});

  const changeCountry = (newCountry: string) => {
    if (newCountry === country) {
      return;
    }
    const providers = topUpProviderSupportService.getProviders(newCountry);
    if (providers.length === 1) {
      onTopUpProviderChanged(providers[0]);
    } else {
      onTopUpProviderChanged(undefined);
    }
    setCountry(newCountry);
  };

  useEffect(() => {
    setFiatClass('fiat-selected');
  }, []);

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
    <div className={`fiat ${fiatClass}`}>
      <div className="fiat-inputs">
        <div className="fiat-input-item">
          <p className="top-up-label">Country</p>
          <CountryDropdown
            selectedCountry={country}
            setCountry={changeCountry}
            setCurrency={setCurrency}
          />
        </div>
        {isPrefilledAmountUsedBy(fiatOptions.topUpProvider) &&
          <div className="fiat-input-item">
            <p className="top-up-label">Amount</p>
            <AmountInput
              selectedCurrency={currency}
              setCurrency={setCurrency}
              amount={fiatOptions.amount}
              onChange={(amount: string) => onFiatOptionsChanged({...fiatOptions, amount})}
            />
          </div>}
      </div>
      {!!country && <>
        <p className="top-up-label fiat-payment-methods-title">Payment method</p>
        <FiatPaymentMethods
          selectedCountry={country}
          supportService={topUpProviderSupportService}
          paymentMethod={fiatOptions.topUpProvider}
          setPaymentMethod={onTopUpProviderChanged}
          logoColor={logoColor}
        />
      </>}
      <div className="fiat-bottom">
        {!!country && <FiatFooter isPaymentMethodChecked={!!fiatOptions.topUpProvider} />}
      </div>
    </div>
  );
};
