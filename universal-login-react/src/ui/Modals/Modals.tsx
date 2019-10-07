import React, {useContext} from 'react';
import {ModalWrapper} from './ModalWrapper';
import WaitingFor from '../commons/WaitingFor';
import {ReactModalContext, TopUpProps} from '../../core/models/ReactModalContext';
import {TopUp} from '../TopUp/TopUp';
import {ChooseConnectionMethod} from '../Connect/ChooseConnectionMethod';

export interface ModalsProps {
  modalClassName?: string;
}

const Modals = ({modalClassName}: ModalsProps) => {
  const modalService = useContext(ReactModalContext);
  switch (modalService.modalName) {
    case 'topUpAccount':
      return (
        <TopUp
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
    case 'chooseConnectionMethod':
      return (
        <ModalWrapper modalPosition="center">
          <ChooseConnectionMethod
            onConnectWithDeviceClick={() => {}}
            onConnectWithPassphraseClick={() => {}}
            onCancel={() => {}}
          />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export default Modals;
