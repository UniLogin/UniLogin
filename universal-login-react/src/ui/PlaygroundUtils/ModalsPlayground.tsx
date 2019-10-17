import React from 'react';
import {ReactModalType, ReactModalProps, ReactModalContext} from '../../core/models/ReactModalContext';
import Modals from '../Modals/Modals';

interface ModalsPlaygroundProps {
  modalService: any;
  modalNames: ReactModalType[];
  modalProps: ReactModalProps[];
}

export const ModalsPlayground = ({modalService, modalNames, modalProps}: ModalsPlaygroundProps) => {
  return (
    <>
      <ReactModalContext.Provider value={modalService}>
        {
          modalNames.map((modalName, index) =>
            <button id="show-topup-button" key={index} onClick={() => modalService.showModal(modalName, modalProps[index])}>
              {`Show ${modalName}`}
            </button>)
        }
        <Modals />
      </ReactModalContext.Provider>
    </>
    );
};
