import React from 'react';
import usdIcon from '../../assets/icons/usd.png';
import etherIcon from '../../assets/icons/ether.svg';
import bitmapIcon from '../../assets/icons/bitmap.svg';
import ModalService from '../../../core/entities/ModalService';

export interface ModalTopUpProps {
  modalService: ModalService;
}

const ModalTopUp = ({modalService}: ModalTopUpProps) => {
  return (
    <>
      <h2 className="modal-title">Top up your account</h2>
      <p className="modal-subtitle">(Lorem ipsum dolor sit amet, consectetur adipisicing)</p>
      <div className="modal-topup-row">
        <div className="modal-topup-block">
          <button className="modal-topup-btn" id="transfer-modal" onClick={() => modalService.showModal('address')}>
            <img className="modal-topup-icon" src={etherIcon} alt="ether"/>
            <div className="modal-topup-separator"/>
            <img className="modal-topup-icon" src={bitmapIcon} alt="bitmap"/>
          </button>
          <p className="modal-text modal-topup-text">Transfer crypto to your wallet</p>
        </div>
        <div className="modal-topup-block">
          <button className="modal-topup-btn" id="buy-modal" onClick={() => modalService.showModal('safello')}>
            <img className="modal-topup-icon" src={usdIcon} alt="Bank account"/>
          </button>
          <p className="modal-text modal-topup-text">Transfer crypto to your wallet</p>
        </div>
      </div>
    </>
  );
};

export default ModalTopUp;

