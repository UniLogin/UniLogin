import React from 'react';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {ConfirmCode} from './ConfirmCode';

interface ConfirmCodeScreenProps {
  hideModal: () => void;
}

export const ConfirmCodeScreen = ({hideModal}: ConfirmCodeScreenProps) => (
  <OnboardingStepsWrapper
    title={'Create account'}
    hideModal={hideModal}
    steps={4}
    progress={2}
  >
    <ConfirmCode />
  </OnboardingStepsWrapper>
);
