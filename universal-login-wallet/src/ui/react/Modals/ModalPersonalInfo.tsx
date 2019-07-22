import React from 'react';
import { useServices } from '../../hooks/useServices';
import {Input} from '@universal-login/react';
import InputLabel from '../common/InputLabel';
import ButtonFullwidth from '../common/ButtonFullwidth';

const ModalPersonalInfo = () => {
  const {modalService} = useServices();

  return (
    <>
      <h2 className="modal-title">Personal information</h2>
      <p className="modal-subtitle">Lorem ipsum dolor sit amet</p>
      <div className="info-modal-fields">
        <InputLabel htmlFor="name">Name</InputLabel>
        <Input
          id="name"
          className="info-modal-input"
          onChange={() => console.log('not implemented')}
          autoFocus
        />
        <InputLabel htmlFor="lastName">Last name</InputLabel>
        <Input
          id="lastName"
          className="info-modal-input"
          onChange={() => console.log('not implemented')}
        />
        <InputLabel htmlFor="address">Address</InputLabel>
        <Input
          id="address"
          className="info-modal-input"
          onChange={() => console.log('not implemented')}
        />
      </div>
      <ButtonFullwidth
        id="buyButton"
        onClick={() => modalService.showModal('cardInfo')}
      >
        Next
      </ButtonFullwidth>
    </>
  );
};

export default ModalPersonalInfo;

