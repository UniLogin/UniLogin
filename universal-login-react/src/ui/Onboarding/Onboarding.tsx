import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {WalletSelector} from '../WalletSelector/WalletSelector';
import Modal from '../Modals/Modal';
import ModalService from '../../core/services/ModalService';

interface OnboardingProps {
  sdk: UniversalLoginSDK;
  onConnectClick: (...args: any[]) => void;
  onCreateClick: (...args: any[]) => void;
  modalService: ModalService;
}

export const Onboarding = ({sdk, onConnectClick, onCreateClick, modalService}: OnboardingProps) => {
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
