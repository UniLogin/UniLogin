import React, {useState, useContext} from 'react';
import {TransferService} from '@universal-login/sdk';
import {TransferDetails, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {ModalTransfer as Transfer} from '@universal-login/react';
import {WalletModalContext} from '../../../../core/entities/WalletModalContext';
import {useServices} from '../../../hooks';

const ModalTransfer = () => {
  const modalService = useContext(WalletModalContext);

  const {walletService, sdk} = useServices();
  const [transferDetails, setTransferDetails] = useState(
    {transferToken: ETHER_NATIVE_TOKEN.address} as TransferDetails,
  );
  const selectedToken = sdk.tokensDetailsStore.getTokenByAddress(transferDetails.transferToken);
  const deployedWallet = walletService.getDeployedWallet();

  const transferService = new TransferService(deployedWallet);
  const onGenerateClick = async () => {
    modalService.showModal('waitingForTransfer');
    try {
      const {waitToBeSuccess, waitForTransactionHash} = await transferService.transfer(transferDetails);
      const {transactionHash} = await waitForTransactionHash();
      modalService.showModal('waitingForTransfer', {transactionHash});
      await waitToBeSuccess();
      modalService.hideModal();
    } catch (e) {
      modalService.showModal('error', `${e.name}: ${e.message}`);
    }
  };

  const updateTransferDetailsWith = (args: Partial<TransferDetails>) => {
    setTransferDetails({...transferDetails, ...args});
  };

  return (
    <Transfer
      deployedWallet={deployedWallet}
      transferDetails={transferDetails}
      updateTransferDetailsWith={updateTransferDetailsWith}
      tokenDetails={selectedToken}
      onSendClick={onGenerateClick}
      transferClassName="jarvis-styles"
    />
  );
};

export default ModalTransfer;
