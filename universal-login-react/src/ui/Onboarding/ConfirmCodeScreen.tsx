import React from 'react';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {ConfirmCode} from './ConfirmCode';
import {WalletService} from '@unilogin/sdk';

interface ConfirmCodeScreenProps {
  hideModal: () => void;
  walletService: WalletService;
}

export const ConfirmCodeScreen = ({hideModal, walletService}: ConfirmCodeScreenProps) => (
  <OnboardingStepsWrapper
    title={'Create account'}
    className='onboarding-confirm-code'
    hideModal={hideModal}
    steps={4}
    progress={2}
    message={walletService.sdk.getNotice()}
  >
    <ConfirmCode
      email={'email@address.com'}
    />
  </OnboardingStepsWrapper>
);
