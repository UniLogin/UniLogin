import React, {useEffect, useState} from 'react';
import {CountryDropdown} from './CountryDropdown';
import {AmountInput} from './AmountInput';
import {TopUpComponentType} from '../../../core/models/TopUpComponentType';
import {FiatFooter} from './FiatFooter';
import {FiatPaymentMethods, LogoColor} from './FiatPaymentMethods';
import {useServices} from '../../../core/services/useServices';
import {useAsyncEffect} from '../../../ui/hooks/useAsyncEffect';
import {countries} from './countries';

export type PaymentMethod = TopUpComponentType.ramp | TopUpComponentType.safello | TopUpComponentType.wyre | undefined;

export interface TopUpWithFiatProps {
  onPayClick: (topUpModalType: TopUpComponentType, amount: string) => void;
  logoColor?: LogoColor;
}

export const TopUpWithFiat = ({onPayClick, logoColor}: TopUpWithFiatProps) => {
  const [country, selectCountry] = useState<string | undefined>(undefined);
  const [selectedCurrency, setCurrency] = useState('GBP');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(undefined);
  const [fiatClass, setFiatClass] = useState('');

  const {ipGeolocationService} = useServices();

  useEffect(() => {
    setFiatClass('fiat-selected');
  }, []);

  async function recognizeUserCountry() {
    const userCountryCode = await ipGeolocationService.getCountryCode()
      .catch(e => console.error(`Failed to establish user's country`, e));

    const userCountry = countries.find(({code}) => code === userCountryCode);
    if (country === undefined && userCountry) {
      selectCountry(userCountry.name);
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
            setCountry={(country: string) => selectCountry(country)}
            setCurrency={(currency: string) => setCurrency(currency)}
          />
        </div>
        <div className="fiat-input-item">
          <p className="top-up-label">Amount</p>
          <AmountInput
            selectedCurrency={selectedCurrency}
            setCurrency={setCurrency}
            amount={amount}
            onChange={(amount: string) => setAmount(amount)}
          />
        </div>
      </div>
      <p className="top-up-label fiat-payment-methods-title">Payment method</p>
      <FiatPaymentMethods paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} logoColor={logoColor}/>
      <div className="fiat-bottom">
        <FiatFooter isPaymentMethodChecked={!!paymentMethod}/>
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
