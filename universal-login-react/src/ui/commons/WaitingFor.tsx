import React from 'react';
import {ProgressBar} from './ProgressBar';
import '../styles/waitingFor.css';

const ModalWaitingFor = () => {
  return (
      <div className="waiting-for-title">
        Waiting for deployment
        <ProgressBar />
      </div>
  );
};

export default ModalWaitingFor;
