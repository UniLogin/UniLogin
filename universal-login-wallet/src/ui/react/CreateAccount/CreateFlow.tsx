import React, {useContext, useState} from 'react';
import {useServices} from '../../hooks';
import {CreateAccount} from './CreateAccount';
import {WalletModalContext} from '../../../core/entities/WalletModalContext';
import {ETHER_NATIVE_TOKEN, GasParameters, INITIAL_GAS_PARAMETERS} from '@universal-login/commons';
import {hideTopUpModal} from '../../../core/utils/hideTopUpModal';
import Modal from '../Modals/Modal';
import {ModalWrapper, TopUp, useProperty, WaitingForDeployment} from '@universal-login/react';
import {ModalTxnSuccess} from '../Modals/ModalTxnSuccess';
import {Redirect} from 'react-router';

export function CreateFlow() {
  const modalService = useContext(WalletModalContext);
  const {sdk, walletService} = useServices();
  const [gasParameters, setGasParameters] = useState<GasParameters>(INITIAL_GAS_PARAMETERS);
  const [transactionHash, setTransactionHash] = useState<string | undefined>(undefined); // TODO: Move to wallet state

  const onCreateClick = async (name: string) => {
    const {waitForBalance} = await walletService.createFutureWallet();
    await waitForBalance();
    modalService.hideModal(); // Needed to clear top-up modals after the funds have arrived
    await walletService.deployFutureWallet(
      name,
      gasParameters.gasPrice.toString(),
      ETHER_NATIVE_TOKEN.address,
      setTransactionHash,
    );
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
            onGasParametersChanged={setGasParameters}
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
              transactionHash={transactionHash}
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
            <ModalTxnSuccess hideModal={modalService.hideModal}/>
          </ModalWrapper>
        </div>
      );
    default:
      return <Redirect to="/"/>;
  }
}
