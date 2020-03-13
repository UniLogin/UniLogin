import React from 'react';
import {TopUpRadio} from '../TopUpRadio';
import {TopUpProvider} from '../../../core/models/TopUpProvider';
import {TopUpProviderSupportService} from '../../../core/services/TopUpProviderSupportService';
import {getOnRampProviderLogo} from './getOnRampProviderLogo';
import {useThemeName, classForComponent} from './../../utils/classFor';

interface FiatPaymentMethodsProps {
  selectedCountry: string;
  supportService: TopUpProviderSupportService;
  paymentMethod?: TopUpProvider;
  setPaymentMethod: (paymentMethod: TopUpProvider) => void;
  logoColor?: LogoColor;
}

interface FiatProviderTopUpProps {
  topUpProvider: TopUpProvider;
  providerLogo: string;
  setPaymentMethod: (paymentMethod: TopUpProvider) => void;
  currentPaymentMethod?: TopUpProvider;
}

export type LogoColor = 'white' | 'black';

const FiatProviderTopUp = ({topUpProvider, providerLogo, setPaymentMethod, currentPaymentMethod}: FiatProviderTopUpProps) => (
  <TopUpRadio
    checked={currentPaymentMethod === topUpProvider}
    onClick={() => setPaymentMethod(topUpProvider)}
    name="payment-method"
    className="fiat-payment-method"
  >
    <img src={providerLogo} srcSet={providerLogo} alt={topUpProvider.toLowerCase()} className={`${topUpProvider.toLowerCase()}-logo`}/>
  </TopUpRadio>
);

export const FiatPaymentMethods = ({selectedCountry, supportService, paymentMethod, setPaymentMethod, logoColor}: FiatPaymentMethodsProps) => {
  const getLogoColorByTheme = (useThemeName() === 'default') ? 'white' : 'black';
  const rampLogo = getOnRampProviderLogo(TopUpProvider.RAMP, logoColor || getLogoColorByTheme);
  const safelloLogo = getOnRampProviderLogo(TopUpProvider.SAFELLO, logoColor || getLogoColorByTheme);
  const wyreLogo = getOnRampProviderLogo(TopUpProvider.WYRE, logoColor || getLogoColorByTheme);
  return (
    <>
      <p className={`
        ${classForComponent('top-up-label')}
        ${classForComponent('fiat-methods-title')}
      `}>Payment method</p>
      <div className="fiat-payment-methods">
        {supportService.checkRampSupport(selectedCountry) &&
          <FiatProviderTopUp topUpProvider={TopUpProvider.RAMP} providerLogo={rampLogo} setPaymentMethod={setPaymentMethod} currentPaymentMethod={paymentMethod} />}
        {supportService.checkSafelloSupport(selectedCountry) &&
          <FiatProviderTopUp topUpProvider={TopUpProvider.SAFELLO} providerLogo={safelloLogo} setPaymentMethod={setPaymentMethod} currentPaymentMethod={paymentMethod} />}
        {supportService.checkWyreSupport(selectedCountry) &&
          <FiatProviderTopUp topUpProvider={TopUpProvider.WYRE} providerLogo={wyreLogo} setPaymentMethod={setPaymentMethod} currentPaymentMethod={paymentMethod} />}
      </div>
    </>
  );
};
