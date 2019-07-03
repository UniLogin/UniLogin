import React, {useState} from 'react';
import Input from '../common/Input';
import InputLabel from '../common/InputLabel';
import InputWithDropdown from '../common/InputWithDropdown';
import ButtonFullwidth from '../common/ButtonFullwidth';
import {useServices} from '../../hooks';
import TransferDetails from '../../../core/entities/TransferDetails';


interface ModalTransferProps {
  hideModal: () => void;
}

const ModalTransfer = ({hideModal}: ModalTransferProps) => {
  const {transferService, tokenService, modalService} = useServices();
  const [transferDetalis, setTransferDetails] = useState({currency: tokenService.tokensDetails[0].symbol} as TransferDetails);

  const onGenerateClick = async () => {
    hideModal();
    modalService.showModal('waitingForTransfer')
    const {transactionHash} = await transferService.transfer(transferDetalis);
    await transferService.waitForTransaction(transactionHash!);
    hideModal();
  };

  const updateTransferDetailsWith = (args: Partial<TransferDetails>) => {
    setTransferDetails({...transferDetalis, ...args});
  };

  return (
    <div className="modal-body transfer-modal">
      <h2 className="modal-title transfer-modal-title">Transfer funds</h2>
      <InputLabel htmlFor="address">To address</InputLabel>
      <Input
        id="address"
        className="transfer-modal-address"
        onChange={event => updateTransferDetailsWith({to: event.target.value})}
        autoFocus
      />
      <InputLabel htmlFor="amount">Amount to send</InputLabel>
      <InputWithDropdown
        id="amount"
        className="transfer-modal-amount"
        onChange={event => updateTransferDetailsWith({amount: event.target.value})}
        currency={transferDetalis.currency}
        setCurrency={event => updateTransferDetailsWith({currency: event})}
      />
      <button className="modal-btn-text">Send entire balance</button>
      <ButtonFullwidth
        id="transferButton"
        onClick={onGenerateClick}
      >
        Generate transaction
      </ButtonFullwidth>
    </div>
  );
};

export default ModalTransfer;
