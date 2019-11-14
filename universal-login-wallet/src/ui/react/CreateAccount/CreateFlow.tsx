import React, {useContext} from 'react';
import {Redirect} from 'react-router';
import {useServices} from '../../hooks';
import {CreateAccount} from './CreateAccount';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';
import {hideTopUpModal} from '../../../core/utils/hideTopUpModal';
import Modal from '../Modals/Modal';
import {ModalWrapper, TopUp, useProperty, WaitingForDeployment} from '@universal-login/react';
import {CreationSuccess} from '../Modals/ModalTxnSuccess';

export function CreateFlow() {
  const modalService = useContext(WalletModalContext);
  const {sdk, walletService, walletCreationService} = useServices();

  const onCreateClick = async (name: string) => {
    walletCreationService.onBalancePresent(() => modalService.hideModal());
    await walletCreationService.initiateCreationFlow(name);
  };

  const walletState = useProperty(walletService.stateProperty);
  switch (walletState.kind) {
    case 'None':
      return <CreateAccount onCreateClick={onCreateClick}/>;
    case 'Future':
      return (
        <div className="main-bg">
          <TopUp
            sdk={sdk}
            contractAddress={walletState.wallet.contractAddress}
            isDeployment
            isModal
            onGasParametersChanged={(gasParameters) => walletCreationService.setGasParameters(gasParameters)}
            hideModal={() => hideTopUpModal(walletService, modalService)}
            showModal={modalService.showModal as any} // FIXME: Types don't match up between react and wallet modals
            modalClassName="topup-modal-wrapper"
            topUpClassName="jarvis-styles"
            logoColor="black"
          />
          <Modal/>
        </div>
      );
    case 'Deploying':
      return (
        <div className="main-bg">
          <ModalWrapper modalClassName="jarvis-modal">
            <WaitingForDeployment
              transactionHash={walletState.transactionHash}
              relayerConfig={sdk.getRelayerConfig()}
              className="jarvis-styles"
            />
          </ModalWrapper>
        </div>
      );
    case 'Deployed':
      return (
        <div className="main-bg">
          <ModalWrapper modalClassName="jarvis-modal">
            <CreationSuccess hideModal={modalService.hideModal}/>
          </ModalWrapper>
        </div>
      );
    default:
      return <Redirect to="/"/>;
  }
}
