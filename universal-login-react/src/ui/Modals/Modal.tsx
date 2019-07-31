import React from 'react';
import {TopUp} from '../TopUp/TopUp';
import {ModalWrapper} from './ModalWrapper';
import ModalService from '../../core/services/ModalService';
import WaitingFor from '../commons/WaitingFor'
import {FutureWallet} from '@universal-login/sdk';

export interface ModalProps {
  modalService: ModalService;
  applicationWallet: FutureWallet
}

const Modal = ({modalService, applicationWallet}: ModalProps) => {
  switch (modalService.modalState) {
    case 'topUpAccount':
      return (
        <ModalWrapper isVisible modalPosition="bottom">
          <TopUp
            contractAddress={applicationWallet.contractAddress}
            onRampConfig={{safello: {
              appId: '1234-5678',
              baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
              addressHelper: true
            }}}
          />
        </ModalWrapper>
      );
    case 'waitingForDeploy':
      return (
        <ModalWrapper isVisible modalPosition="bottom">
          <WaitingFor />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export default Modal;
