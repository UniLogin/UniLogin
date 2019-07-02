import React from 'react';

const ModalWrapper = ({children} : {children: any}) => (
  <>
    <div className="modal-overlay" />
    <div className="modal-wrapper">
      <div className="modal">
        {children}
      </div>
    </div>
  </>
);

export default ModalWrapper;
