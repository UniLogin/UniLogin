import React from 'react';

const ModalWrapper = ({children, onClose} : {children: any, onClose: () => void}) => (
  <>
    <div className="modal-overlay" onClick={onClose} />
    <div className="modal">
      <button className="modal-close-btn" onClick={onClose} />
      {children}
    </div>
  </>
);

export default ModalWrapper;
