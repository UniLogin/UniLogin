import React from 'react';
import {InputLabel} from '@universal-login/react';
import qrCodePlacehoder from '../../assets/placeholders/qr-code-placeholder.png';
import InputWithButton from '../common/InputWithButton';
import {Hint} from '../common/Hint';

const addressPlaceholder = '0xf902fd8B2AEE76AE81bBA106d667';

const ModalRequest = () => (
  <div className="modal-body request-modal">
    <div className="box-header">
      <h2 className="box-title">Recieve</h2>
    </div>
    <div className="modal-content">
      <div className="qr-code">
        <img src={qrCodePlacehoder} alt="Qrcode placeholder"/>
      </div>
      <InputLabel htmlFor="address">Receiving address</InputLabel>
      <InputWithButton
        id="address"
        value={addressPlaceholder}
        className="request-modal-address"
      />
      <div className="receive-modal-hints">
        <Hint color="yellow">All your Ethereum tokens have the same address</Hint>
        <Hint color="red">Only send Ethereum token to this address.</Hint>
      </div>
    </div>
  </div>
);

export default ModalRequest;

