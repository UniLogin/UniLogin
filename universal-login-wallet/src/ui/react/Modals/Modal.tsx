import React, {useContext} from 'react';
import ModalWrapperWithoutClose from './ModalWrapper';
import ModalTransfer from './Transfer/ModalTransfer';
import ModalRequest from './ModalRequest';
import {useRelayerConfig, useServices} from '../../hooks';
import ModalWrapperClosable from './ModalWrapperClosable';
import ModalWaitingFor from './ModalWaitingFor';
import {ModalWrapper, Safello, TopUp} from '@universal-login/react';
import {ModalTxnSuccess} from './ModalTxnSuccess';
import {TopUpModalProps, WalletModalContext} from '../../../core/entities/WalletModalContext';
import {hideTopUpModal} from '../../../core/utils/hideTopUpModal';

const Modal = () => {
  const modalService = useContext(WalletModalContext);
  const {walletPresenter, walletService, sdk} = useServices();
  const relayerConfig = useRelayerConfig();

  switch (modalService.modalName) {
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
    case 'topUpAccount':
      return relayerConfig ? (
        <TopUp
          sdk={sdk}
          {...modalService.modalProps as TopUpModalProps}
          modalClassName="topup-modal-wrapper"
          topUpClassName="jarvis-styles"
          contractAddress={walletPresenter.getContractAddress()}
          isModal
          logoColor="black"
          hideModal={() => hideTopUpModal(walletService, modalService)}
        />
      ) : null;
    case 'waitingForDeploy':
      return (
        <ModalWrapper modalClassName="jarvis-modal">
          <ModalWaitingFor {...modalService.modalProps} action={'Wallet creation'} chainName={relayerConfig!.chainSpec.name} transactionHash={'0x5a63…f3a68a'}/>
        </ModalWrapper>
      );
    case 'waitingForTransfer':
      return (
        <ModalWrapperWithoutClose>
          <ModalWaitingFor {...modalService.modalProps} action={'Transferring funds'} chainName={relayerConfig!.chainSpec.name} />
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
            localizationConfig={relayerConfig!.localization}
            safelloConfig={relayerConfig!.onRampProviders.safello}
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
