import React, {useState} from 'react';
import {WalletService} from '@unilogin/sdk';
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
import {FooterSection} from '../../commons/FooterSection';
import {getPayButtonState} from '../../../app/TopUp/getPayButtonState';
import {PayButton} from '../PayButton';

export interface TopUpWithFiatProps {
  walletService: WalletService;
  amount: string;
  onAmountChange: (value: string) => void;
  paymentMethod?: TopUpProvider;
  onPaymentMethodChange: (value: TopUpProvider | undefined) => void;
  logoColor?: LogoColor;
  onPayClick: (topUpProvider: TopUpProvider, currency: string) => void;
}

export const TopUpDetails = ({walletService, onPayClick, logoColor, amount, onAmountChange, paymentMethod, onPaymentMethodChange}: TopUpWithFiatProps) => {
  const [country, setCountry] = useState<string | undefined>(undefined);
  const defaultCurrency = walletService.isKind('Future') ? walletService.getFutureWallet().getTopUpCurrencySymbol() : 'ETH';
  const [currency, setCurrency] = useState(defaultCurrency);
  const [topUpProviderSupportService] = useState(() => new TopUpProviderSupportService(countries));

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
          <CountryDropdown
            selectedCountry={country}
            setCountry={changeCountry}
          />
          {!!country &&
            <FiatPaymentMethods
              selectedCountry={country}
              supportService={topUpProviderSupportService}
              paymentMethod={paymentMethod}
              setPaymentMethod={onPaymentMethodChange}
              logoColor={logoColor}
            />}
          {topUpProviderSupportService.isInputAmountUsed(paymentMethod) &&
            <AmountInput
              selectedCurrency={currency}
              setCurrency={setCurrency}
              amount={amount}
              onChange={onAmountChange}
              walletService={walletService}
              regularCurrenciesList={['ETH', 'DAI', 'USDC']}
            />
          }
          <div className={classForComponent('fiat-bottom')}>
            {!!country && <FiatFooter
              paymentMethod={paymentMethod}
              walletService={walletService}
              selectedCurrency={currency}
            />}
          </div>
        </div>
      </div>
      <FooterSection>
        <PayButton
          onClick={() => onPayClick(paymentMethod!, currency)}
          state={getPayButtonState(paymentMethod, topUpProviderSupportService, amount, 'fiat')}
        />
      </FooterSection>
    </div>
  );
};
