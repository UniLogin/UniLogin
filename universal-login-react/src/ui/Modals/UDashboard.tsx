import React, {useContext} from 'react';
import {ReactUModalContext} from '../../core/models/ReactUModalContext';
import {ModalWrapper} from './ModalWrapper';

const UDashboard = () => {
  const modalService = useContext(ReactUModalContext);
  switch (modalService.modalState) {
    case 'funds':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <Header />
          Funds
        </ModalWrapper>
      );
    case 'approveDevice':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <Header />
          ApproveDevice
        </ModalWrapper>
      );
    case 'settings':
      return (
        <ModalWrapper hideModal={modalService.hideModal}>
          <Header />
          Settings
        </ModalWrapper>
      );
    default:
      return null;
  }
};

const Header = () => {
  const modalService = useContext(ReactUModalContext);
  return (
    <div>
      <button onClick={() => modalService.showModal('funds')}>Funds</button>
      <button onClick={() => modalService.showModal('approveDevice')}>ApproveDevice</button>
      <button onClick={() => modalService.showModal('settings')}>Settings</button>
    </div>
  );
};

export default UDashboard;
