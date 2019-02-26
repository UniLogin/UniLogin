import React from 'react';

const ModalWrapper = ({children} : {children: any}) => (
  <>
    <div className="modal-overlay" />
    <div className="modal">
      {children}
    </div>
  </>
);

export default ModalWrapper;
