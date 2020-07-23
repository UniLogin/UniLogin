import React from 'react';
import {OnboardingStepsWrapper} from './OnboardingStepsWrapper';
import {EmailFlowCodeProps, EmailFlowCode} from './EmailFlowCode';

interface EmailFlowCodeScreenProps extends EmailFlowCodeProps{
  title: 'Create account' | 'Log in';
  hideModal: () => void;
}

export const EmailFlowCodeScreen = ({title, hideModal, onConfirm, onCodeChange, onBack}: EmailFlowCodeScreenProps) => (
  <OnboardingStepsWrapper
  title={title}
  hideModal={hideModal}
  >
    <EmailFlowCode
      onConfirm={onConfirm}
      onCodeChange={onCodeChange}
      onBack={onBack}
    />
  </OnboardingStepsWrapper>
);
