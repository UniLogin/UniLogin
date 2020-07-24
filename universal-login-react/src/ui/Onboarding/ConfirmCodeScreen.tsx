import React from 'react';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {ConfirmCodeProps, ConfirmCode} from './ConfirmCode';

interface ConfirmCodeScreenProps extends ConfirmCodeProps{
  title: 'Create account' | 'Log in';
  hideModal: () => void;
}

export const ConfirmCodeScreen = ({title, hideModal, onConfirm, onBack}: ConfirmCodeScreenProps) => (
  <OnboardingStepsWrapper
    title={title}
    hideModal={hideModal}
    steps={4}
    progress={2}
  >
    <ConfirmCode
      onConfirm={onConfirm}
      onBack={onBack}
    />
  </OnboardingStepsWrapper>
);
