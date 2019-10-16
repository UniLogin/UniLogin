import React, {useContext} from 'react';
import ModalWrapperWithoutClose from './ModalWrapper';
import ModalTransfer from './Transfer/ModalTransfer';
import ModalRequest from './ModalRequest';
import {useServices} from '../../hooks';
import ModalWrapperClosable from './ModalWrapperClosable';
import {ModalWrapper, Safello, TopUp, WaitingFor} from '@universal-login/react';
import {ModalTxnSuccess} from './ModalTxnSuccess';
import {TopUpModalProps, WalletModalContext} from '../../../core/entities/WalletModalContext';
import {hideTopUpModal} from '../../../core/utils/hideTopUpModal';
import {ImageWaitingFor} from '../common/ImageWaitingFor';

const Modal = () => {
  const modalService = useContext(WalletModalContext);
  const {walletPresenter, walletService, sdk} = useServices();
  const relayerConfig = sdk.getRelayerConfig();

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
          <WaitingFor
            {...modalService.modalProps}
            action={'Wallet creation'}
            relayerConfig={relayerConfig!}
            children={ImageWaitingFor()}
            className={'jarvis-waiting-for'}
          />
        </ModalWrapper>
      );
    case 'waitingForTransfer':
      return (
        <ModalWrapperWithoutClose>
          <WaitingFor
            {...modalService.modalProps}
            action={'Transferring funds'}
            relayerConfig={relayerConfig!}
            children={ImageWaitingFor()}
            className={'jarvis-waiting-for'}
          />
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
              <div className="modal">
                <div className="error-message">
                  <div>Something went wrong.. Try again.</div>
                  <div>{modalService.modalProps}</div>
                </div>
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
