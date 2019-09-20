import React, {useContext} from 'react';
import ModalWrapperWithoutClose from './ModalWrapper';
import ModalTransfer from './Transfer/ModalTransfer';
import ModalRequest from './ModalRequest';
import {useServices, useRelayerConfig} from '../../hooks';
import ModalWrapperClosable from './ModalWrapperClosable';
import ModalWaitingFor from './ModalWaitingFor';
import {Safello, TopUp, ModalWrapper} from '@universal-login/react';
import {ModalTxnSuccess} from './ModalTxnSuccess';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';
import {ConnectionNotificationModal} from '../ConnectAccount/ConnectionNotificationModal';

const Modal = () => {
  const modalService = useContext(WalletModalContext);
  const {walletPresenter, walletService, sdk} = useServices();
  const relayerConfig = useRelayerConfig();

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
    case 'approveDevice':
      return (
        <ModalWrapperClosable hideModal={modalService.hideModal}>
          <ConnectionNotificationModal
            sdk={sdk}
            contractAddress={walletService.getDeployedWallet().contractAddress}
            privateKey={walletService.getDeployedWallet().privateKey}
          />
        </ModalWrapperClosable>
      );
    case 'topUpAccount':
      return relayerConfig ? (
        <TopUp
          modalClassName="topup-modal-wrapper"
          topUpClassName="jarvis-topup"
          onRampConfig={relayerConfig.onRampProviders}
          contractAddress={walletPresenter.getContractAddress()}
          isModal
          logoColor="black"
        />
      ) : null;
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
      return relayerConfig ? (
        <ModalWrapperWithoutClose>
          <Safello
            localizationConfig={relayerConfig.localization}
            safelloConfig={relayerConfig.onRampProviders.safello}
            contractAddress={walletPresenter.getContractAddress()}
            crypto="eth"
          />
        </ModalWrapperWithoutClose>
      ) : null;
    case 'error':
      return (
        <ModalWrapperClosable hideModal={modalService.hideModal}>
          <div className="jarvis-modal">
            <div className="box-header">
              <h2 className="box-title">Error</h2>
            </div>
            <div className="modal-content">
              <div className="error-message">
                <div>Something went wrong.. Try again.</div>
                <div>{modalService.modalProps}</div>
              </div>
            </div>
          </div>
        </ModalWrapperClosable>
      );
    default:
      return null;
  }
};

export default Modal;
