
import React, {useContext} from 'react';
import {ReactUModalContext} from '../../core/models/ReactUModalContext';

export const UHeader = () => {
  const modalService = useContext(ReactUModalContext);
  return (
    <div>
      <button onClick={() => modalService.showModal('funds')}>Funds</button>
      <button onClick={() => modalService.showModal('approveDevice')}>ApproveDevice</button>
      <button onClick={() => modalService.showModal('settings')}>Settings</button>
    </div>
  );
};
