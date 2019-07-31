import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modal from '../Modals/Modal';
import {useModal} from '../../core/services/useModal';

interface OnboardingProps {
  sdk: UniversalLoginSDK;
  onConnect: () => void;
  onCreate: () => void;
  domains: string[];
}

export const Onboarding = ({sdk, onConnect, onCreate, domains}: OnboardingProps) => {
  const modalService = useModal();

  const onConnectClick = () => {
    onConnect();
  };

  const onCreateClick = () => {
    modalService.showModal('topUpAccount');
    onCreate();
  };

  return (
    <div>
      <WalletSelector
        sdk={sdk}
        onCreateClick={onCreateClick}
        onConnectClick={onConnectClick}
        domains={domains}
      />
      <Modal modalService={modalService}/>
    </div>
  );
};
