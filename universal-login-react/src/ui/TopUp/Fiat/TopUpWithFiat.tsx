import React, {useEffect, useState} from 'react';
import {CountryDropdown} from './CountryDropdown';
import {AmountInput} from './AmountInput';
import {FiatFooter} from './FiatFooter';
import {FiatPaymentMethods, LogoColor} from './FiatPaymentMethods';
import {useServices} from '../../../core/services/useServices';
import {useAsyncEffect} from '../../../ui/hooks/useAsyncEffect';
import {countries} from '../../../core/utils/countries';
import {TopUpProvider} from '../../../core/models/TopUpProvider';

export interface TopUpWithFiatProps {
  onPayClick: (topUpProvider: TopUpProvider, amount: string) => void;
  logoColor?: LogoColor;
}

export const TopUpWithFiat = ({onPayClick, logoColor}: TopUpWithFiatProps) => {
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [currency, setCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<TopUpProvider | undefined>(undefined);
  const [fiatClass, setFiatClass] = useState('');
  const {ipGeolocationService, topUpProviderSupportService} = useServices();

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
    const userCountryCode = await ipGeolocationService.getCountryCode().catch(console.error);

    const userCountry = countries.find(({code}) => code === userCountryCode);
    if (country === undefined && userCountry) {
      changeCountry(userCountry.name);
      setCurrency(userCountry.currency);
    }
    return () => {};
  }

  useAsyncEffect(() => recognizeUserCountry(), []);

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
        <div className="fiat-input-item">
          <p className="top-up-label">Amount</p>
          <AmountInput
            selectedCurrency={currency}
            setCurrency={setCurrency}
            amount={amount}
            onChange={(amount: string) => setAmount(amount)}
          />
        </div>
      </div>
      {!!country && <>
          <p className="top-up-label fiat-payment-methods-title">Payment method</p>
          <FiatPaymentMethods
              selectedCountry={country}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              logoColor={logoColor}
          />
      </>}
      <div className="fiat-bottom">
        {!!country && <FiatFooter isPaymentMethodChecked={!!paymentMethod}/>}
        <button
          onClick={() => onPayClick(paymentMethod!, amount)}
          className="pay-btn"
          disabled={!paymentMethod || !amount}
        >
          Pay
        </button>
      </div>
    </div>
  );
};
