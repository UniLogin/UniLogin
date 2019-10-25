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

export type LogoColor = 'white' | 'black';

const renderRampTopUp = (rampLogo: string, setPaymentMethod: (paymentMethod: TopUpProvider) => void, paymentMethod?: TopUpProvider) => (
  <TopUpRadio
    checked={paymentMethod === TopUpProvider.RAMP}
    onClick={() => setPaymentMethod(TopUpProvider.RAMP)}
    name="payment-method"
    className="fiat-payment-method"
  >
    <img src={rampLogo} srcSet={rampLogo} alt="ramp" className="ramp-logo"/>
  </TopUpRadio>
)

const renderSafelloTopUp = (safelloLogo: string, setPaymentMethod: (paymentMethod: TopUpProvider) => void, paymentMethod?: TopUpProvider) => (
  <TopUpRadio
    checked={paymentMethod === TopUpProvider.SAFELLO}
    onClick={() => setPaymentMethod(TopUpProvider.SAFELLO)}
    name="payment-method"
    className="fiat-payment-method"
  >
    <img src={safelloLogo} srcSet={safelloLogo} alt="safello" className="safello-logo"/>
  </TopUpRadio>
)

const renderWyreTopUp = (wyreLogo: string, setPaymentMethod: (paymentMethod: TopUpProvider) => void, paymentMethod?: TopUpProvider) => (
  <TopUpRadio
    checked={paymentMethod === TopUpProvider.WYRE}
    onClick={() => setPaymentMethod(TopUpProvider.WYRE)}
    name="payment-method"
    className="fiat-payment-method"
  >
    <img src={wyreLogo} srcSet={wyreLogo} alt="wyre" className="wyre-logo"/>
  </TopUpRadio>
)

export const FiatPaymentMethods = ({selectedCountry, supportService, paymentMethod, setPaymentMethod, logoColor = 'white'}: FiatPaymentMethodsProps) => {
  const rampLogo = getOnRampProviderLogo('ramp', logoColor);
  const safelloLogo = getOnRampProviderLogo('safello', logoColor);
  const wyreLogo = getOnRampProviderLogo('wyre', logoColor);

  return (
    <div className="fiat-payment-methods">
      {supportService.checkRampSupport(selectedCountry) && renderRampTopUp(rampLogo, setPaymentMethod, paymentMethod)}
      {supportService.checkSafelloSupport(selectedCountry) && renderSafelloTopUp(safelloLogo, setPaymentMethod, paymentMethod)}
      {supportService.checkWyreSupport(selectedCountry) && renderWyreTopUp(wyreLogo, setPaymentMethod, paymentMethod)}
    </div>
  );
};
