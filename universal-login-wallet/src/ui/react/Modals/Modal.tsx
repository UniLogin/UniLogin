import React from 'react';
import ModalWrapperWithoutClose from './ModalWrapper';
import ModalTransfer from './ModalTransfer';
import ModalRequest from './ModalRequest';
import ModalInvitation from './ModalInvitation';
import {useServices, useRelayerConfig} from '../../hooks';
import ModalWrapperClosable from './ModalWrapperClosable';
import ModalAddress from './ModalAddress';
import ModalPersonalInfo from './ModalPersonalInfo';
import ModalCardInfo from './ModalCardInfo';
import ModalWaitingFor from './ModalWaitingFor';
import {Safello, TopUp, ModalWrapper} from '@universal-login/react';
import {ModalTxnSuccess} from './ModalTxnSuccess';
import ModalService from '../../../core/entities/ModalService';

export interface ModalProps {
  modalService: ModalService;
}

const Modal = ({modalService}: ModalProps) => {
  const {walletPresenter} = useServices();
  const config = useRelayerConfig();
  switch (modalService.modalState) {
    case 'transfer':
      return (
        <ModalWrapperClosable hideModal={modalService.hideModal}>
          <ModalTransfer modalService={modalService}/>
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
        <ModalWrapper isVisible modalPosition="bottom">
          <TopUp
            onRampConfig={config!.onRampProviders}
            contractAddress={walletPresenter.getContractAddress()}
          />
        </ModalWrapper>
      );
    case 'address':
      return (
        <ModalWrapperWithoutClose>
          <ModalAddress />
        </ModalWrapperWithoutClose>
      );
    case 'personalInfo':
      return (
        <ModalWrapperWithoutClose>
          <ModalPersonalInfo modalService={modalService}/>
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
        <ModalWrapper isVisible modalClassName="jarvis-modal">
          <ModalWaitingFor action={'Txn pending'}/>
        </ModalWrapper>
      );
    case 'waitingForTransfer':
      return (
        <ModalWrapperWithoutClose>
          <ModalWaitingFor action={'Transferring funds'}/>
        </ModalWrapperWithoutClose>
      );
    case 'transactionSuccess':
      return (
        <ModalWrapper isVisible modalClassName="jarvis-modal">
          <ModalTxnSuccess hideModal={modalService.hideModal}/>
        </ModalWrapper>
      );
    case 'safello':
      return config ?  (
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
