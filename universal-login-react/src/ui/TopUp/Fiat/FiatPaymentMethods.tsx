import React from 'react';
import {TopUpRadio} from '../TopUpRadio';
import {TopUpProvider} from '../../../core/models/TopUpProvider';
import {TopUpProviderSupportService} from '../../../core/services/TopUpProviderSupportService';
import {getOnRampProviderLogo} from './getOnRampProviderLogo';

interface FiatPaymentMethodsProps {
  selectedCountry: string;
  supportService: TopUpProviderSupportService;
  paymentMethod?: TopUpProvider;
  setPaymentMethod: (paymentMethod: TopUpProvider) => void;
  logoColor?: LogoColor;
}

interface FiatProviderTopUpProps {
  providerLogo: string;
  setPaymentMethod: (paymentMethod: TopUpProvider) => void;
  paymentMethod?: TopUpProvider;
}

export type LogoColor = 'white' | 'black';

const RampTopUp = ({providerLogo, setPaymentMethod, paymentMethod}: FiatProviderTopUpProps) => (
  <TopUpRadio
    checked={paymentMethod === TopUpProvider.RAMP}
    onClick={() => setPaymentMethod(TopUpProvider.RAMP)}
    name="payment-method"
    className="fiat-payment-method"
  >
    <img src={providerLogo} srcSet={providerLogo} alt="ramp" className="ramp-logo"/>
  </TopUpRadio>
);

const SafelloTopUp = ({providerLogo, setPaymentMethod, paymentMethod}: FiatProviderTopUpProps) => (
  <TopUpRadio
    checked={paymentMethod === TopUpProvider.SAFELLO}
    onClick={() => setPaymentMethod(TopUpProvider.SAFELLO)}
    name="payment-method"
    className="fiat-payment-method"
  >
    <img src={providerLogo} srcSet={providerLogo} alt="safello" className="safello-logo"/>
  </TopUpRadio>
);

const WyreTopUp = ({providerLogo, setPaymentMethod, paymentMethod}: FiatProviderTopUpProps) => (
  <TopUpRadio
    checked={paymentMethod === TopUpProvider.WYRE}
    onClick={() => setPaymentMethod(TopUpProvider.WYRE)}
    name="payment-method"
    className="fiat-payment-method"
  >
    <img src={providerLogo} srcSet={providerLogo} alt="wyre" className="wyre-logo"/>
  </TopUpRadio>
);

export const FiatPaymentMethods = ({selectedCountry, supportService, paymentMethod, setPaymentMethod, logoColor = 'white'}: FiatPaymentMethodsProps) => {
  const rampLogo = getOnRampProviderLogo('ramp', logoColor);
  const safelloLogo = getOnRampProviderLogo('safello', logoColor);
  const wyreLogo = getOnRampProviderLogo('wyre', logoColor);

  return (
    <div className="fiat-payment-methods">
      {supportService.checkRampSupport(selectedCountry) &&
        <RampTopUp providerLogo={rampLogo} setPaymentMethod={setPaymentMethod} paymentMethod={paymentMethod} />}
      {supportService.checkSafelloSupport(selectedCountry) &&
        <SafelloTopUp providerLogo={safelloLogo} setPaymentMethod={setPaymentMethod} paymentMethod={paymentMethod} />}
      {supportService.checkWyreSupport(selectedCountry) &&
        <WyreTopUp providerLogo={wyreLogo} setPaymentMethod={setPaymentMethod} paymentMethod={paymentMethod} />}
    </div>
  );
};
