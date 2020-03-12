import React, {useState} from 'react';
import {WalletService} from '@unilogin/sdk';
import {LogoColor, TopUpWithFiat} from './Fiat';
import {TopUpWithCrypto} from './TopUpWithCrypto';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {ChooseTopUpMethodWrapper} from './ChooseTopUpMethodWrapper';
import {ChooseTopUpMethodHeader} from './ChooseTopUpMethodHeader';
import {ModalProgressBar} from '../commons/ModalProgressBar';
import {classForComponent} from '../utils/classFor';
import {CompanyLogo} from '../commons/CompanyLogo';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';

export interface ChooseTopUpMethodProps {
  walletService: WalletService;
  onPayClick: (topUpProvider: TopUpProvider, amount: string) => void;
  logoColor?: LogoColor;
  setTopUpMethod: (any: any) => void;
  topUpMethod: TopUpMethod;
  setModal?: (any: any) => void;
}

export const ChooseTopUpMethod = ({walletService, topUpMethod, setTopUpMethod, setModal}: ChooseTopUpMethodProps) => {
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
    </ChooseTopUpMethodWrapper>
  );
};
