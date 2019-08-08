import React, {useState, useContext} from 'react';
import {useServices} from '../../../hooks';
import TransferDetails from '../../../../core/entities/TransferDetails';
import {WalletModalContext} from '../../../../core/entities/WalletModalContext';
import {ModalTransferAmount} from './ModalTransferAmount';
import {ModalTransferRecipient} from './ModalTransferRecipient';

const ModalTransfer = () => {
  const modalService = useContext(WalletModalContext);
  const [modal, setModal] = useState('transferAmount');

  const {transferService, tokensDetailsStore} = useServices();
  const [transferDetalis, setTransferDetails] = useState({currency: tokensDetailsStore.tokensDetails[0].symbol} as TransferDetails);

  const onGenerateClick = async () => {
    modalService.hideModal();
    modalService.showModal('waitingForTransfer');
    await transferService.transfer(transferDetalis);
    modalService.hideModal();
  };

  const updateTransferDetailsWith = (args: Partial<TransferDetails>) => {
    setTransferDetails({...transferDetalis, ...args});
  };

  if (modal === 'transferAmount') {
    return (
      <ModalTransferAmount
        onSelectRecipientClick={() => setModal('transferRecipient')}
        updateTransferDetailsWith={updateTransferDetailsWith}
        currency={transferDetalis.currency}
      />
    );
  } else if (modal === 'transferRecipient') {
    return (
      <ModalTransferRecipient
        onRecipientChange={event => updateTransferDetailsWith({to: event.target.value})}
        onSendClick={onGenerateClick}
        onBackClick={() => setModal('transferAmount')}
      />
    );
  }
  return null;
};

export default ModalTransfer;
