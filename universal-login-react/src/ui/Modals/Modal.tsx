import React from 'react';
import {TopUp} from '../TopUp/TopUp';
import {ModalWrapper} from './ModalWrapper';
import {createKeyPair} from '@universal-login/commons';
import ModalService from '../../core/services/ModalService';

export interface ModalProps {
  modalService: ModalService;
}

const Modal = ({modalService}: ModalProps) => {
  switch (modalService.modalState) {
    case 'topUpAccount':
      return (
        <ModalWrapper isVisible modalPosition="bottom">
          <TopUp
            contractAddress={createKeyPair().publicKey}
            onRampConfig={{safello: {
              appId: '1234-5678',
              baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
              addressHelper: true
            }}}
          />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export default Modal;
