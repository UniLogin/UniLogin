import React from 'react';
import {ReactModalType, ReactModalProps, ReactModalContext} from '../../core/models/ReactModalContext';
import Modals from '../Modals/Modals';

export const renderModals = (modalService: any, modalNames: ReactModalType[], modalProps: ReactModalProps[]) => {
  return (
    <>
      <ReactModalContext.Provider value={modalService}>
        {modalNames.map((modalName, index) => <button id="show-topup-button" key={index} onClick={() => modalService.showModal(modalName, modalProps[index])}>{`Show ${modalName}`}</button>)}
        <Modals />
      </ReactModalContext.Provider>
    </>
    );
};
