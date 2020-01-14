import React, {useState} from 'react';
import {WalletService} from '@universal-login/sdk';
import {LogoColor, TopUpWithFiat} from './Fiat';
import {TopUpWithCrypto} from './TopUpWithCrypto';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {FooterSection} from '../commons/FooterSection';
import {TopUpProviderSupportService} from '../../core/services/TopUpProviderSupportService';
import {countries} from '../../core/utils/countries';
import {PayButton} from './PayButton';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {getPayButtonState} from '../../app/TopUp/getPayButtonState';
import {ChooseTopUpMethodWrapper} from './ChooseTopUpMethodWrapper';
import {ChooseTopUpMethodHeader} from './ChooseTopUpMethodHeader';

export interface ChooseTopUpMethodProps {
  walletService: WalletService;
  onPayClick: (topUpProvider: TopUpProvider, amount: string) => void;
  topUpClassName?: string;
  logoColor?: LogoColor;
}

export const ChooseTopUpMethod = ({walletService, onPayClick, topUpClassName, logoColor}: ChooseTopUpMethodProps) => {
  const [topUpMethod, setTopUpMethod] = useState<TopUpMethod>(undefined);
  const [topUpProviderSupportService] = useState(() => new TopUpProviderSupportService(countries));
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<TopUpProvider | undefined>(undefined);

  return (
    <ChooseTopUpMethodWrapper className={topUpClassName} topUpMethod={topUpMethod}>
      <ChooseTopUpMethodHeader
        topUpMethod={topUpMethod}
        setTopUpMethod={setTopUpMethod}
      />
      {topUpMethod === 'crypto' && <TopUpWithCrypto
        walletService={walletService}
      />}
      {topUpMethod === 'fiat' && <TopUpWithFiat
        walletService={walletService}
        topUpProviderSupportService={topUpProviderSupportService}
        amount={amount}
        onAmountChange={setAmount}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        logoColor={logoColor}
      />}
      {topUpMethod && <FooterSection className={topUpClassName}>

        <PayButton
          onClick={() => onPayClick(paymentMethod!, amount)}
          state={getPayButtonState(paymentMethod, topUpProviderSupportService, amount, topUpMethod)}
        />
      </FooterSection>}
    </ChooseTopUpMethodWrapper>
  );
};
