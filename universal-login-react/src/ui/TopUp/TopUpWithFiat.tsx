import React, {useState, useEffect} from 'react';
import {CountryDropdown} from './CountryDropdown';
import {AmountInput} from './AmountInput';
import {TopUpRadio} from './TopUpRadio';
import SafelloLogo from './../assets/logos/safello.png';
import SafelloLogo2x from './../assets/logos/safello@2x.png';
import RampLogo from './../assets/logos/ramp.png';
import RampLogo2x from './../assets/logos/ramp@2x.png';
import WyreLogo from './../assets/logos/wyre.png';
import WyreLogo2x from './../assets/logos/wyre@2x.png';
import MastercardLogo from './../assets/logos/mastercard.jpg';
import MastercardLogo2x from './../assets/logos/mastercard@2x.jpg';
import VisaLogo from './../assets/logos/visa.jpg';
import VisaLogo2x from './../assets/logos/visa@2x.jpg';
import {OnRampConfig} from '@universal-login/commons';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';


export interface TopUpWithFiatProps {
  contractAddress: string;
  onPayClick: (topUpModalType: TopUpComponentType) => void;
  onRampConfig: OnRampConfig;
}

export const TopUpWithFiat = ({contractAddress, onRampConfig, onPayClick}: TopUpWithFiatProps) => {
  const [country, selectCountry] = useState('United Kingdom');
  const [selectedCode, setCode] = useState('GBP');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<TopUpComponentType.ramp | TopUpComponentType.safello | TopUpComponentType.wyre | undefined>(undefined);
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
      <div className="fiat-payment-methods">
        <TopUpRadio
          checked={paymentMethod === TopUpComponentType.ramp}
          onClick={() => setPaymentMethod(TopUpComponentType.ramp)}
          name="payment-method"
          className="fiat-payment-method"
        >
          <img src={RampLogo} srcSet={RampLogo2x} alt="ramp" className="ramp-logo" />
        </TopUpRadio>
        <TopUpRadio
          checked={paymentMethod === TopUpComponentType.safello}
          onClick={() => setPaymentMethod(TopUpComponentType.safello)}
          name="payment-method"
          className="fiat-payment-method"
        >
          <img src={SafelloLogo} srcSet={SafelloLogo2x} alt="safello" className="safello-logo" />
        </TopUpRadio>
        <TopUpRadio
          checked={paymentMethod === TopUpComponentType.wyre}
          onClick={() => setPaymentMethod(TopUpComponentType.wyre)}
          name="payment-method"
          className="fiat-payment-method"
        >
          <img src={WyreLogo} srcSet={WyreLogo2x} alt="wyre" className="wyre-logo" />
        </TopUpRadio>
      </div>
      <div className="fiat-bottom">
        {paymentMethod
          ? <div className="info-block info-row">
              <p className="info-text info-text-hint">You can pay by MasterCard or Visa</p>
              <div className="info-row">
                <img
                  src={VisaLogo}
                  srcSet={VisaLogo2x}
                  className="visa-logo"
                  alt="Visa"
                />
                <img
                  src={MastercardLogo}
                  srcSet={MastercardLogo2x}
                  className="mastercard-logo"
                  alt="Mastercard"
                />
              </div>
            </div>
          : <p className="info-text info-text-warning">Choose payment method</p>
        }
        <button onClick={() => onPayClick(paymentMethod!)} className="pay-btn" disabled={!paymentMethod || !amount}>Pay</button>
      </div>
    </div>
  );
};
