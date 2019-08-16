import React, {useContext} from 'react';
import ModalWrapperWithoutClose from './ModalWrapper';
import ModalTransfer from './Transfer/ModalTransfer';
import ModalRequest from './ModalRequest';
import ModalInvitation from './ModalInvitation';
import {useServices, useRelayerConfig} from '../../hooks';
import ModalWrapperClosable from './ModalWrapperClosable';
import ModalPersonalInfo from './ModalPersonalInfo';
import ModalCardInfo from './ModalCardInfo';
import ModalWaitingFor from './ModalWaitingFor';
import {Safello, TopUp, ModalWrapper} from '@universal-login/react';
import {ModalTxnSuccess} from './ModalTxnSuccess';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';

const Modal = () => {
  const modalService = useContext(WalletModalContext);
  const {walletPresenter} = useServices();
  const config = useRelayerConfig();
  switch (modalService.modalState) {
    case 'transfer':
      return (
        <ModalWrapperClosable hideModal={modalService.hideModal}>
          <ModalTransfer />
        </ModalWrapperClosable>
      );
    case 'request':
      return (
        <ModalWrapperClosable hideModal={modalService.hideModal}>
          <ModalRequest />
        </ModalWrapperClosable>
      );
    case 'invitation':
      return (
        <ModalWrapperClosable hideModal={modalService.hideModal}>
          <ModalInvitation />
        </ModalWrapperClosable>
      );
    case 'topUpAccount':
      return (
        <TopUp
          modalClassName="topup-modal-wrapper"
          topUpClassName="jarvis-topup"
          onRampConfig={config!.onRampProviders}
          contractAddress={walletPresenter.getContractAddress()}
          isModal
        />
      );
    case 'personalInfo':
      return (
        <ModalWrapperWithoutClose>
          <ModalPersonalInfo />
        </ModalWrapperWithoutClose>
      );
    case 'cardInfo':
      return (
        <ModalWrapperWithoutClose>
          <ModalCardInfo />
        </ModalWrapperWithoutClose>
      );
    case 'waitingForDeploy':
      return (
        <ModalWrapper modalClassName="jarvis-modal">
          <ModalWaitingFor action={'Txn pending'} />
        </ModalWrapper>
      );
    case 'waitingForTransfer':
      return (
        <ModalWrapperWithoutClose>
          <ModalWaitingFor action={'Transferring funds'} />
        </ModalWrapperWithoutClose>
      );
    case 'transactionSuccess':
      return (
        <ModalWrapper modalClassName="jarvis-modal">
          <ModalTxnSuccess hideModal={modalService.hideModal} />
        </ModalWrapper>
      );
    case 'safello':
      return config ? (
        <ModalWrapperWithoutClose>
          <Safello
            localizationConfig={config.localization}
            safelloConfig={config.onRampProviders.safello}
            contractAddress={walletPresenter.getContractAddress()}
            crypto="eth"
          />
        </ModalWrapperWithoutClose>
      ) : null;
    default:
      return null;
  }
};

export default Modal;
