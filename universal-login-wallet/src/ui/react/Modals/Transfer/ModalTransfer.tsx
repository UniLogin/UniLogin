import React, {useState, useContext} from 'react';
import {TransferService} from '@universal-login/sdk';
import {TransferDetails} from '@universal-login/commons';
import {ModalTransferRecipient, ModalTransferAmount} from '@universal-login/react';
import {WalletModalContext} from '../../../../core/entities/WalletModalContext';
import {useServices} from '../../../hooks';

const ModalTransfer = () => {
  const modalService = useContext(WalletModalContext);
  const [modal, setModal] = useState('transferAmount');

  const {walletService, sdk} = useServices();
  const [transferDetails, setTransferDetails] = useState({currency: sdk.tokensDetailsStore.tokensDetails[0].symbol} as TransferDetails);

  const applicationWallet = walletService.getDeployedWallet();

  const transferService = new TransferService(sdk, applicationWallet);
  const onGenerateClick = async () => {
    modalService.showModal('waitingForTransfer', 'The transaction will start in a moment');
    try {
      const {waitToBeSuccess, waitForTransactionHash} = await transferService.transfer(transferDetails);
      const {transactionHash} = await waitForTransactionHash();
      modalService.showModal('waitingForTransfer', transactionHash);
      await waitToBeSuccess();
      modalService.hideModal();
    } catch (e) {
      modalService.showModal('error', `${e.name}: ${e.message}`);
    }
  };

  const updateTransferDetailsWith = (args: Partial<TransferDetails>) => {
    setTransferDetails({...transferDetails, ...args});
  };

  if (modal === 'transferAmount') {
    return (
      <ModalTransferAmount
        sdk={sdk}
        contractAddress={applicationWallet.contractAddress}
        onSelectRecipientClick={() => setModal('transferRecipient')}
        updateTransferDetailsWith={updateTransferDetailsWith}
        currency={transferDetails.currency}
        transferAmountClassName="jarvis-transfer-amount"
      />
    );
  } else if (modal === 'transferRecipient') {
    return (
      <ModalTransferRecipient
        onRecipientChange={event => updateTransferDetailsWith({to: event.target.value})}
        onSendClick={onGenerateClick}
        onBackClick={() => setModal('transferAmount')}
        transferDetails={transferDetails}
        transferRecipientClassName="jarvis-transfer-recipient"
      />
    );
  }
  return null;
};

export default ModalTransfer;
