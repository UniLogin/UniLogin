import React from 'react';
import {ReactModalType, ReactModalProps, ReactModalContext} from '../../core/models/ReactModalContext';
import Modals from '../Modals/Modals';

export const renderModal = (modalService: any, modalName: ReactModalType, modalProps?: ReactModalProps) => {
  return (
    <>
      <ReactModalContext.Provider value={modalService}>
        <button id="show-topup-button" onClick={() => modalService.showModal(modalName, modalProps)}>{`Show ${modalName}`}</button>
        <Modals />
      </ReactModalContext.Provider>
    </>
    );
};
