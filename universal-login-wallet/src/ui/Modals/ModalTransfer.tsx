import React, {useState} from 'react';
import Input from '../common/Input';
import InputLabel from '../common/InputLabel';
import InputWithDropdown from '../common/InputWithDropdown';
import ButtonFullwidth from '../common/ButtonFullwidth';

const ModalTransfer = () => {
  const [transferDetalis, setTransferDetails] = useState({});
  const onGenerateClick = () => console.log(transferDetalis);
  const updateTransferDetailsWith = (name: string, value: string) => {
    setTransferDetails({...transferDetalis, [`${name}`]: value});
  }
  return (
    <div className="transfer-modal">
      <h2 className="modal-title transfer-modal-title">Transfer funds</h2>
      <InputLabel htmlFor="address">To address</InputLabel>
      <Input
        id="address"
        className="transfer-modal-address"
        onChange={(event) => updateTransferDetailsWith('targetAddress', event.target.value)}
        autoFocus
      />
      <InputLabel htmlFor="amount">Amount to send</InputLabel>
      <InputWithDropdown
        id="amount"
        onChange={(event) => updateTransferDetailsWith('amount', event.target.value)}
        onCurrencyChange={(currency) => updateTransferDetailsWith('currency', currency)}
      />
      <button className="btn-text">Send entire balance</button>
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
