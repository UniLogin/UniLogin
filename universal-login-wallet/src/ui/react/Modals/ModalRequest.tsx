import React from 'react';
import {InputLabel} from '@universal-login/react';
import InputWithButton from '../common/InputWithButton';
import {Hint} from '../common/Hint';
import {useServices} from '../../hooks';
import {QRCode} from 'react-qr-svg';

const ModalRequest = () => {
  const {walletPresenter} = useServices();
  return (
    <div className="modal-body request-modal">
      <div className="box-header">
        <h2 className="box-title">Recieve</h2>
      </div>
      <div className="modal-content">
        <div className="qr-code">
          <QRCode level="M" width={128} height={128} value={walletPresenter.getContractAddress()} />
        </div>
        <InputLabel htmlFor="address">Receiving address</InputLabel>
        <InputWithButton
          id="address"
          value={walletPresenter.getContractAddress()}
          className="request-modal-address"
        />
        <div className="receive-modal-hints">
          <Hint color="yellow">All your Ethereum tokens have the same address</Hint>
          <Hint color="red">Only send Ethereum token to this address.</Hint>
        </div>
      </div>
    </div>
  );
};

export default ModalRequest;
