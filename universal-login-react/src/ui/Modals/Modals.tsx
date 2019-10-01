import React, {useContext} from 'react';
import {ModalWrapper} from './ModalWrapper';
import WaitingFor from '../commons/WaitingFor';
import {ReactModalContext, TopUpProps} from '../../core/models/ReactModalContext';
import {TopUp} from '../TopUp/TopUp';
import UniversalLoginSDK from '@universal-login/sdk';

export interface ModalsProps {
  sdk: UniversalLoginSDK;
  modalClassName?: string;
}

const Modals = ({modalClassName, sdk}: ModalsProps) => {
  const modalService = useContext(ReactModalContext);
  switch (modalService.modalState) {
    case 'topUpAccount':
      return (
        <TopUp
          sdk={sdk}
          hideModal={modalService.hideModal}
          modalClassName={modalClassName}
          {...modalService.modalProps as TopUpProps}
          isModal
        />
      );
    case 'waitingForDeploy':
      return (
        <ModalWrapper modalPosition="bottom">
          <WaitingFor />
        </ModalWrapper>
      );
    case 'topUp':
      return (
        <ModalWrapper modalPosition="bottom">
          <WaitingFor />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export default Modals;
