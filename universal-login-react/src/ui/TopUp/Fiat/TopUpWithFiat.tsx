import React, {useState} from 'react';
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

export interface TopUpWithFiatProps {
  sdk: UniversalLoginSDK;
  topUpProviderSupportService: TopUpProviderSupportService;
  amount: string;
  onAmountChange: (value: string) => void;
  paymentMethod?: TopUpProvider;
  onPaymentMethodChange: (value: TopUpProvider | undefined) => void;
  logoColor?: LogoColor;
  minimalAmount?: string;
}

export const TopUpWithFiat = ({sdk, logoColor, topUpProviderSupportService, amount, onAmountChange, paymentMethod, onPaymentMethodChange, minimalAmount}: TopUpWithFiatProps) => {
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [currency, setCurrency] = useState('ETH');

  const changeCountry = (newCountry: string) => {
    if (newCountry === country) {
      return;
    }
    const providers = topUpProviderSupportService.getProviders(newCountry);
    if (providers.length === 1) {
      onPaymentMethodChange(providers[0]);
    } else {
      onPaymentMethodChange(undefined);
    }
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
    <div className="top-up-body">
      <div className="top-up-body-inner">
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
            {topUpProviderSupportService.isInputAmountUsed(paymentMethod) &&
              <div className="fiat-input-item">
                <p className="top-up-label">Amount</p>
                <AmountInput
                  selectedCurrency={currency}
                  setCurrency={setCurrency}
                  amount={amount}
                  onChange={onAmountChange}
                />
              </div>}
          </div>
          {!!country && <>
            <p className="top-up-label fiat-payment-methods-title">Payment method</p>
            <FiatPaymentMethods
              selectedCountry={country}
              supportService={topUpProviderSupportService}
              paymentMethod={paymentMethod}
              setPaymentMethod={onPaymentMethodChange}
              logoColor={logoColor}
            />
          </>}
          <div className="fiat-bottom">
            {!!country &&
            <FiatFooter
              paymentMethod={paymentMethod}
              minimalAmount={minimalAmount}
            />}
          </div>
        </div>
      </div>
    </div>
  );
};
