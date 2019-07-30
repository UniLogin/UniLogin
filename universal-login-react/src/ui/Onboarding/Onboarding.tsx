import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modal from '../Modals/Modal';
import ModalService from '../../core/services/ModalService';
import {useModal} from '../../core/services/useModal';

interface OnboardingProps {
  sdk: UniversalLoginSDK;
  onConnect: () => void;
  onCreate: () => void;
}

export const Onboarding = ({sdk, onConnect, onCreate}: OnboardingProps) => {
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
        domains={['mylogin.eth', 'myapp.eth']}
      />
      <Modal modalService={modalService}/>
    </div>
  );
};
