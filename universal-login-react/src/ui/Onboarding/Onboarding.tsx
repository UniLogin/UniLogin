import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modal from '../Modals/Modal';

interface OnboardingProps {
  sdk: UniversalLoginSDK;
  onConnectClick: (...args: any[]) => void;
  onCreateClick: (...args: any[]) => void;
}

export const Onboarding = ({sdk, onConnectClick, onCreateClick}: OnboardingProps) => {
  return (
    <div>
      <WalletSelector
        sdk={sdk}
        onCreateClick={onCreateClick}
        onConnectClick={onConnectClick}
        domains={['mylogin.eth', 'myapp.eth']}
      />
      <Modal />
    </div>
  );
};
