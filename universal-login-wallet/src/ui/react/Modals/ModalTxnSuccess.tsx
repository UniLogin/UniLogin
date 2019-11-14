import React from 'react';
import send1x from './../../assets/illustrations/send@1x.png';
import send2x from './../../assets/illustrations/send@2x.png';
import {Link} from 'react-router-dom';
import {useServices} from '../../hooks';

interface ModalTxnSuccessProps {
  hideModal: () => void;
  operation: string;
  text: string;
}

export const ModalTxnSuccess = ({hideModal, operation, text}: ModalTxnSuccessProps) => {
  const {walletPresenter} = useServices();
  return (
    <>
      <div className="box-header">
        <h1 className="box-title">{operation}</h1>
      </div>
      <div className="box-content modal-succes-content">
        <img
          className="modal-avatar-succes"
          src={send1x}
          srcSet={send2x}
          alt="succes"
        />
        <div className="created-account">
          <div>
            <p className="created-account-label">{walletPresenter.getName()}</p>
            <p className="created-account-hash">{walletPresenter.getContractAddress()}</p>
          </div>
        </div>
        <p className="congratulation-text">
          Congratulations! {text}
        </p>
        <Link to="/" onClick={hideModal} className="button-primary modal-success-btn">Go to your wallet</Link>
      </div>
    </>
  );
};

interface CreationSuccessProps {
  hideModal: () => void;
}

export const CreationSuccess = ({hideModal}: CreationSuccessProps) =>
  <ModalTxnSuccess
    hideModal={hideModal}
    operation='Wallet creation'
    text='You have just created your wallet.'
  />;

export const ConnectionSuccess = ({hideModal}: CreationSuccessProps) =>
  <ModalTxnSuccess
    hideModal={hideModal}
    operation='Connecting device succeed!'
    text='You have just connected new device.'
  />;
