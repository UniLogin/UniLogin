import React, {useState} from 'react';
import {WalletService} from '@unilogin/sdk';
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
import {ModalProgressBar} from '../commons/ModalProgressBar';
import {classForComponent} from '../utils/classFor';
import {CompanyLogo} from '../commons/CompanyLogo';
import {IncomingTransactionsView} from './IncomingTransactionsView';

export interface ChooseTopUpMethodProps {
  walletService: WalletService;
  onPayClick: (topUpProvider: TopUpProvider, amount: string) => void;
  logoColor?: LogoColor;
}

export const ChooseTopUpMethod = ({walletService, onPayClick, logoColor}: ChooseTopUpMethodProps) => {
  const [topUpMethod, setTopUpMethod] = useState<TopUpMethod>(undefined);
  const [topUpProviderSupportService] = useState(() => new TopUpProviderSupportService(countries));
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<TopUpProvider | undefined>(undefined);

  return (
    <ChooseTopUpMethodWrapper topUpMethod={topUpMethod}>
      <CompanyLogo />
      <div className={classForComponent('onboarding-progress-wrapper')}>
        <ModalProgressBar steps={3} progress={2}/>
      </div>
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
      {topUpMethod &&
        <FooterSection>
          <PayButton
            onClick={() => onPayClick(paymentMethod!, amount)}
            state={getPayButtonState(paymentMethod, topUpProviderSupportService, amount, topUpMethod)}
          />
        </FooterSection>
      }
    </ChooseTopUpMethodWrapper>
  );
};
