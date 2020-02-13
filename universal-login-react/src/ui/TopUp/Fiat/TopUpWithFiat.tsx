import React, {useState} from 'react';
import {WalletService} from '@universal-login/sdk';
import {CountryDropdown} from './CountryDropdown';
import {AmountInput} from './AmountInput';
import {FiatFooter} from './FiatFooter';
import {FiatPaymentMethods, LogoColor} from './FiatPaymentMethods';
import {useAsyncEffect} from '../../../ui/hooks/useAsyncEffect';
import {countries} from '../../../core/utils/countries';
import {TopUpProvider} from '../../../core/models/TopUpProvider';
import {IPGeolocationService} from '../../../integration/http/IPGeolocationService';
import {TopUpProviderSupportService} from '../../../core/services/TopUpProviderSupportService';
import {classForComponent} from '../../utils/classFor';
import {Label} from '../../commons/Form/Label';
import {InfoText} from '../../commons/Text/InfoText';

export interface TopUpWithFiatProps {
  walletService: WalletService;
  topUpProviderSupportService: TopUpProviderSupportService;
  amount: string;
  onAmountChange: (value: string) => void;
  paymentMethod?: TopUpProvider;
  onPaymentMethodChange: (value: TopUpProvider | undefined) => void;
  logoColor?: LogoColor;
}

export const TopUpWithFiat = ({walletService, logoColor, topUpProviderSupportService, amount, onAmountChange, paymentMethod, onPaymentMethodChange}: TopUpWithFiatProps) => {
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
    const {ipGeolocationApi} = walletService.sdk.getRelayerConfig();
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
    <div className={classForComponent('top-up-body')}>
      <div className={classForComponent('top-up-body-inner')}>
        <div className="fiat fiat-selected">
          <Label>Country</Label>
          <CountryDropdown
            selectedCountry={country}
            setCountry={changeCountry}
            setCurrency={setCurrency}
          />
          {!!country && <>
            <p className={`
              ${classForComponent('top-up-label')}
              ${classForComponent('fiat-methods-title')}
            `}>Payment method</p>
            <FiatPaymentMethods
              selectedCountry={country}
              supportService={topUpProviderSupportService}
              paymentMethod={paymentMethod}
              setPaymentMethod={onPaymentMethodChange}
              logoColor={logoColor}
            />
          </>}
          {topUpProviderSupportService.isInputAmountUsed(paymentMethod) &&
            <>
              <Label>Amount</Label>
              <AmountInput
                selectedCurrency={currency}
                setCurrency={setCurrency}
                amount={amount}
                onChange={onAmountChange}
              />
              <InfoText>Minimum amount is 30 GBP</InfoText>
            </>
          }
          <div className={classForComponent('fiat-bottom')}>
            {!!country && <FiatFooter paymentMethod={paymentMethod} walletService={walletService} />}
          </div>
        </div>
      </div>
    </div>
  );
};
