import React from 'react';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {ConfirmCode} from './ConfirmCode';
import {WalletService, WalletState, InvalidWalletState} from '@unilogin/sdk';

interface ConfirmCodeScreenProps {
  hideModal?: () => void;
  walletService: WalletService;
  onConfirmCode: () => void;
}

const getTitleForConfirmCode = (walletState: WalletState) => {
  switch (walletState.kind) {
    case 'RequestedCreating':
      return 'Create account';
    case 'RequestedRestoring':
      return 'Log-in';
    default:
      throw new InvalidWalletState('RequestedCreating or RequestedRestoring', walletState.kind);
  }
};

export const ConfirmCodeScreen = ({hideModal, walletService, onConfirmCode}: ConfirmCodeScreenProps) => (
  <OnboardingStepsWrapper
    title={getTitleForConfirmCode(walletService.state)}
    className='onboarding-confirm-code'
    hideModal={hideModal}
    steps={4}
    progress={2}
    message={walletService.sdk.getNotice()}
  >
    <ConfirmCode
      email={walletService.getEnsNameOrEmail()}
      onConfirmCode={onConfirmCode}
      walletService={walletService}
    />
  </OnboardingStepsWrapper>
);
