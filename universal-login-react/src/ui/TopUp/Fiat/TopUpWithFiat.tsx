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
import {PayButton} from '../PayButton';

export interface TopUpWithFiatProps {
  sdk: UniversalLoginSDK;
  onPayClick: (topUpProvider: TopUpProvider, amount: string) => void;
  logoColor?: LogoColor;
}

export const TopUpWithFiat = ({sdk, onPayClick, logoColor}: TopUpWithFiatProps) => {
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [currency, setCurrency] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<TopUpProvider | undefined>(undefined);
  const [fiatClass, setFiatClass] = useState('');

  const topUpProviderSupportService = new TopUpProviderSupportService(countries);

  const changeCountry = (newCountry: string) => {
    if (newCountry === country) {
      return;
    }
    const providers = topUpProviderSupportService.getProviders(newCountry);
    if (providers.length === 1) {
      setPaymentMethod(providers[0]);
    } else {
      setPaymentMethod(undefined);
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
        {topUpProviderSupportService.isInputAmountUsed(paymentMethod) &&
          <div className="fiat-input-item">
            <p className="top-up-label">Amount</p>
            <AmountInput
              selectedCurrency={currency}
              setCurrency={setCurrency}
              amount={amount}
              onChange={(amount: string) => setAmount(amount)}
            />
          </div>}
      </div>
      {!!country && <>
        <p className="top-up-label fiat-payment-methods-title">Payment method</p>
        <FiatPaymentMethods
          selectedCountry={country}
          supportService={topUpProviderSupportService}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          logoColor={logoColor}
        />
      </>}
      <div className="fiat-bottom">
        {!!country && <FiatFooter isPaymentMethodChecked={!!paymentMethod} />}
        <PayButton
          onClick={onPayClick}
          amount={amount}
          paymentMethod={paymentMethod}
          topUpProviderSupportService={topUpProviderSupportService}
        />
      </div>
    </div>
  );
};
