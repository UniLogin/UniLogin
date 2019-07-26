import React from 'react';
import send1x from './../../assets/illustrations/send@1x.png';
import send2x from './../../assets/illustrations/send@2x.png';
import {Link} from 'react-router-dom';

export const ModalTxnSuccess = () => (
  <>
      <div className="box-header">
        <h1 className="box-title">Txn Success</h1>
      </div>
      <div className="box-content modal-succes-content">
        <h3 className="modal-section-title transaction-status-title">Transaction status</h3>
        <img
          className="modal-avatar-succes"
          src={send1x}
          srcSet={send2x}
          alt="succes"
        />
        <div className="created-account">
          <img className="created-account-avatar" src="" alt="avatar"/>
          <div>
            <p className="created-account-label">Account name</p>
            <p className="created-account-hash">0xEb451578Ff05E9E742…ged36354</p>
          </div>
        </div>
        <p className="info-text">Your wallet is ready but not secure. Go to your wallet and make sure to follow the steps to.</p>
        <Link to="/" className="button-secondary modal-succes-btn">Go to your wallet</Link>
      </div>
  </>
);
