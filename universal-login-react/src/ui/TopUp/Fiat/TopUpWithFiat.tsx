import React, {useState, useEffect} from 'react';
import {CountryDropdown} from './CountryDropdown';
import {AmountInput} from './AmountInput';
import {TopUpComponentType} from '../../../core/models/TopUpComponentType';
import {FiatFooter} from './FiatFooter';
import {FiatPaymentMethods, LogoColor} from './FiatPaymentMethods';

export type PaymentMethod = TopUpComponentType.ramp | TopUpComponentType.safello | TopUpComponentType.wyre | undefined;
export interface TopUpWithFiatProps {
  onPayClick: (topUpModalType: TopUpComponentType, amount: string) => void;
  logoColor?: LogoColor;
}

export const TopUpWithFiat = ({onPayClick, logoColor}: TopUpWithFiatProps) => {
  const [country, selectCountry] = useState('United Kingdom');
  const [selectedCode, setCode] = useState('GBP');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(undefined);
  const [fiatClass, setFiatClass] = useState('');

  useEffect(() => {
    setFiatClass('fiat-selected');
  }, []);

  return (
    <div className={`fiat ${fiatClass}`}>
      <div className="fiat-inputs">
        <div className="fiat-input-item">
          <p className="top-up-label">Country</p>
          <CountryDropdown
            selectedCountry={country}
            setCountry={(country: string) => selectCountry(country)}
            setCode={(code: string) => setCode(code)}
          />
        </div>
        <div className="fiat-input-item">
          <p className="top-up-label">Amount</p>
          <AmountInput
            seletedCode={selectedCode}
            setCode={setCode}
            amount={amount}
            onChange={(amount: string) => setAmount(amount)}
          />
        </div>
      </div>
      <p className="top-up-label fiat-payment-methods-title">Payment method</p>
      <FiatPaymentMethods paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} logoColor={logoColor}/>
      <div className="fiat-bottom">
        <FiatFooter isPaymentMethodChecked={!!paymentMethod} />
        <button onClick={() => onPayClick(paymentMethod!, amount)} className="pay-btn" disabled={!paymentMethod || !amount}>Pay</button>
      </div>
    </div>
  );
};
