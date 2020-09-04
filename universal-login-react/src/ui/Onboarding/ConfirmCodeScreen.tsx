import React from 'react';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {ConfirmCode} from './ConfirmCode';
import {WalletService, WalletState, InvalidWalletState} from '@unilogin/sdk';

interface ConfirmCodeScreenProps {
  hideModal?: () => void;
  walletService: WalletService;
  onCancel: () => void;
  onConfirmCode: () => void;
}

const getTitleForConfirmCode = (walletState: WalletState) => {
  switch (walletState.kind) {
    case 'RequestedCreating':
      return 'Create account';
    case 'RequestedRestoring':
      return 'Log-in';
    case 'RequestedMigrating':
    case 'ConfirmedMigrating':
      return 'Secure wallet';
    default:
      throw new InvalidWalletState('RequestedCreating or RequestedRestoring or RequestedMigrating or ConfirmedMigrating', walletState.kind);
  }
};

export const ConfirmCodeScreen = ({hideModal, walletService, onCancel, onConfirmCode}: ConfirmCodeScreenProps) => (
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
      onCancel={onCancel}
      onConfirmCode={onConfirmCode}
      walletService={walletService}
    />
  </OnboardingStepsWrapper>
);
