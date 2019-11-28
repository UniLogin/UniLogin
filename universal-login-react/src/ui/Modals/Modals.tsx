import React, {useContext} from 'react';
import {ModalWrapper} from './ModalWrapper';
import {ReactModalContext, ConnectionFlowProps} from '../../core/models/ReactModalContext';
import {ConnectionFlow} from '../ConnectionFlow';

export interface ModalsProps {
  modalClassName?: string;
}

const Modals = ({modalClassName}: ModalsProps) => {
  const modalService = useContext(ReactModalContext);

  switch (modalService.modalName) {
    case 'connectionFlow':
      return (
        <ModalWrapper>
          <ConnectionFlow
            onCancel={modalService.hideModal}
            {...modalService.modalProps as ConnectionFlowProps}
          />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export default Modals;
