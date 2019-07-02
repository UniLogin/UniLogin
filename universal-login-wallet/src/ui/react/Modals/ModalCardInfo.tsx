import React from 'react';
import Input from '../common/Input';
import InputLabel from '../common/InputLabel';
import { Link } from 'react-router-dom';

const ModalCardInfo = () => {
  return (
    <>
      <h2 className="modal-title">Amount: <span className="modal-card-amount">$10</span></h2>
      <p className="modal-subtitle">Lorem ipsum dolor sit amet</p>
      <div className="card-modal-fields">
        <InputLabel htmlFor="name">Cardholder name</InputLabel>
        <Input
          id="name"
          className="card-modal-input"
          onChange={() => console.log('not implemented')}
          autoFocus
        />
        <InputLabel htmlFor="cardNumber">Last name</InputLabel>
        <Input
          id="cardNumber"
          className="card-modal-input"
          onChange={() => console.log('not implemented')}
        />
        <div className="card-modal-row">
          <div className="card-modal-row-item">
            <InputLabel htmlFor="mounth">Expiry mounth</InputLabel>
            <Input
              id="mounth"
              type="number"
              onChange={() => console.log('not implemented')}
            />
          </div>
          <div className="card-modal-row-item">
            <InputLabel htmlFor="year">Expiry year</InputLabel>
            <Input
              id="year"
              type="number"
              onChange={() => console.log('not implemented')}
            />
          </div>
          <div className="card-modal-row-item">
            <InputLabel htmlFor="cvc">CVC</InputLabel>
            <Input
              id="cvc"
              type="number"
              onChange={() => console.log('not implemented')}
            />
          </div>
        </div>
      </div>
      <Link to="/transferring" id="buyButton" className="btn btn-primary btn-fullwidth link">Buy</Link>
    </>
  );
};

export default ModalCardInfo;

