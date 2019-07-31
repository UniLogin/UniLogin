import React from 'react';
import {TopUp} from '../TopUp/TopUp';
import {ModalWrapper} from './ModalWrapper';
import {WalletService} from '@universal-login/sdk';
import ModalService from '../../core/services/ModalService';
import WaitingFor from '../commons/WaitingFor'

export interface ModalProps {
  modalService: ModalService;
  walletService: WalletService
}

const Modal = ({modalService, walletService}: ModalProps) => {
  console.log(walletService)
  switch (modalService.modalState) {
    case 'topUpAccount':
      return (
        <ModalWrapper isVisible modalPosition="bottom">
          <TopUp
            contractAddress={walletService.applicationWallet!.contractAddress}
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
        <WaitingFor />
      );
    default:
      return null;
  }
};

export default Modal;
