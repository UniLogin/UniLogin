import React from 'react';
import etherIcon from '../../assets/icons/ether.svg';
import bitmapIcon from '../../assets/icons/bitmap.svg';
import InputWithButton from '../common/InputWithButton';
import InputLabel from '../common/InputLabel';
import {useServices} from '../../hooks';

const ModalAddress = () => {
  const {walletService} = useServices();
  return(
  <div className="modal-body address-modal">
    <h2 className="modal-title">Transfer one of following </h2>
    <p className="modal-subtitle">With minimum amount</p>
    <div className="address-modal-row">
      <div className="address-modal-block">
        <img src={etherIcon} alt="ethereum icon" className="address-modal-coin"/>
        <p className="address-modal-amount">0,005 ETH</p>
      </div>
      <div className="address-modal-block">
        <img src={bitmapIcon} alt="ethereum icon" className="address-modal-coin"/>
        <p className="address-modal-amount">2 dai</p>
      </div>
    </div>
      <InputLabel htmlFor="addressButton">To following address:</InputLabel>
      <InputWithButton id="addressButton" value={walletService.userWallet!.contractAddress} autoFocus/>
      <p className="modal-text address-modal-text">The cost of wallet creation will be: 0,002 ETH or 0,5 dai  Transfer will be automatically discovered.</p>
  </div>
  );
};

export default ModalAddress;
