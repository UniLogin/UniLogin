import React from 'react';
import InputLabel from '../common/InputLabel';
import InputWithDropdown from '../common/InputWithDropdown';
import qrCodePlacehoder from '../../assets/placeholders/qrcode-placeholder.svg';
import InputWithButton from '../common/InputWithButton';
import TextArea from '../common/TextArea';
import ButtonFullwidth from '../common/ButtonFullwidth';

const addressPlaceholder = '0xf902fd8B2AEE76AE81bBA106d667';

const ModalRequest = () => (
  <div className="request-modal">
    <h2 className="modal-title request-modal-title">Request funds</h2>
    <div className="qr-code">
      <img src={qrCodePlacehoder} alt="Qrcode placeholder"/>
    </div>
    <InputLabel htmlFor="amount">Amount to receive</InputLabel>
    <InputWithDropdown
      id="amount"
      className="request-modal-amount"
      onChange={() => alert('not implemented')}
      autoFocus
    />
    <InputLabel htmlFor="address">Receiving address</InputLabel>
    <InputWithButton
      id="address"
      value={addressPlaceholder}
      className="request-modal-address"
    />
    <InputLabel htmlFor="description">Description</InputLabel>
    <TextArea
      id="description"
      className="request-modal-description"
      onChange={() => alert('not implemented')}
    />
    <ButtonFullwidth id="requestButton" onClick={() => alert('not implemented')}>Request</ButtonFullwidth>
  </div>
);

export default ModalRequest;

