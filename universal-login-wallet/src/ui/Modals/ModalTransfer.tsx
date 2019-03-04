import React, {useState} from 'react';
import Input from '../common/Input';
import InputLabel from '../common/InputLabel';
import InputWithDropdown from '../common/InputWithDropdown';
import ButtonFullwidth from '../common/ButtonFullwidth';
import {useServices} from '../../hooks';
import {TransferDetails} from '../../services/TransferService';

const shortcuts = ['ETH', 'DAI', 'UNL'];


interface ModalTransferProps {
  hideModal: () => void;
}

const ModalTransfer = ({hideModal}: ModalTransferProps) => {
  const [transferDetalis, setTransferDetails] = useState({currency: shortcuts[0]} as TransferDetails);
  const [currentCurrency, setCurrentCurrency] = useState(shortcuts[0]);

  const {transferService} = useServices();

  const onGenerateClick = async () => {
    await transferService.transferTokens({
        to: transferDetalis.to,
        amount: transferDetalis.amount,
        currency: '0x0E2365e86A50377c567E1a62CA473656f0029F1e'
      }
    );
    hideModal();
  };

  const updateTransferDetailsWith = (name: string, value: string) => {
    setTransferDetails({...transferDetalis, [`${name}`]: value});
  };

  return (
    <div className="transfer-modal">
      <h2 className="modal-title transfer-modal-title">Transfer funds</h2>
      <InputLabel htmlFor="address">To address</InputLabel>
      <Input
        id="address"
        className="transfer-modal-address"
        onChange={event => updateTransferDetailsWith('to', event.target.value)}
        autoFocus
      />
      <InputLabel htmlFor="amount">Amount to send</InputLabel>
      <InputWithDropdown
        id="amount"
        onChange={event => updateTransferDetailsWith('amount', event.target.value)}
        setCurrency={currency => setCurrentCurrency(currency)}
        currency={currentCurrency}
        shortcuts={shortcuts}
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
