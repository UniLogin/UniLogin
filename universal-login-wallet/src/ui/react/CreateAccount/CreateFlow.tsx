import React, {useContext} from 'react';
import {useServices} from '../../hooks';
import {CreateAccount} from './CreateAccount';
import {TopUpModalProps, WalletModalContext} from '../../../core/entities/WalletModalContext';
import {ETHER_NATIVE_TOKEN, GasParameters, INITIAL_GAS_PARAMETERS} from '@universal-login/commons';
import {hideTopUpModal} from '../../../core/utils/hideTopUpModal';
import Modal from '../Modals/Modal';

export function CreateFlow() {
  const modalService = useContext(WalletModalContext);
  const {walletService} = useServices();

  const showWaitingModal = (transactionHash?: string) => modalService.showModal('waitingForDeploy', {transactionHash});

  const onCreateClick = async (name: string) => {
    let gasParameters = INITIAL_GAS_PARAMETERS;
    const {waitForBalance} = await walletService.createFutureWallet();
    const topUpProps: TopUpModalProps = {
      onGasParametersChanged: (parameters: GasParameters) => {
        gasParameters = parameters;
      },
      isDeployment: true,
      hideModal: () => hideTopUpModal(walletService, modalService),
      showModal: modalService.showModal,
    };
    modalService.showModal('topUpAccount', topUpProps);
    await waitForBalance();
    showWaitingModal();
    await walletService.deployFutureWallet(
      name,
      gasParameters.gasPrice.toString(),
      ETHER_NATIVE_TOKEN.address,
      showWaitingModal,
    );
    modalService.showModal('transactionSuccess');
  };

  return (
    <>
      <CreateAccount onCreateClick={onCreateClick}/>
      <Modal/>
    </>
  );
}
