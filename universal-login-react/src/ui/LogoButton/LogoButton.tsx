import React from 'react';
import icon from '../assets/icons/ether.svg';
import {createModalService} from '../../core/services/createModalService';
import UDashboard from '../Modals/UDashboard';
import {ReactUModalType, ReactUModalProps, ReactUModalContext} from '../../core/models/ReactUModalContext';

export const LogoButton = () => {
  const modalService = createModalService<ReactUModalType, ReactUModalProps>();

  return (
    <>
      <ReactUModalContext.Provider value={modalService}>
        <button onClick={() => modalService.showModal('funds')}>
          <img src={icon} alt="notifications"/>
        </button>
        <UDashboard />
      </ReactUModalContext.Provider>
    </>
  );
};
