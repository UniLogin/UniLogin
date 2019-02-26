import React from 'react';
import Input from '../common/Input';
import InputLabel from '../common/InputLabel';
import InputWithDropdown from '../common/InputWithDropdown';
import ButtonFullwidth from '../common/ButtonFullwidth';

const ModalTransfer = () => {
  return (
    <div className="transfer-modal">
      <h2 className="modal-title transfer-modal-title">Transfer funds</h2>
      <InputLabel htmlFor="address">To address</InputLabel>
      <Input
        id="address"
        className="transfer-modal-address"
        onChange={() => alert('not implemented')}
        autoFocus
      />
      <InputLabel htmlFor="amount">Amount to send</InputLabel>
      <InputWithDropdown
        id="amount"
        onChange={() => alert('not implemented')}
      />
      <button className="btn-text">Send entire balance</button>
      <ButtonFullwidth
        id="transferButton"
        onClick={() => alert('not implemented')}
      >
        Generate transaction
      </ButtonFullwidth>
    </div>
  );
};

export default ModalTransfer;

