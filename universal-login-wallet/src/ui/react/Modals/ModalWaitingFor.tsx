import React from 'react';
import {Spinner} from '@universal-login/react';
import ProgressBar from '../common/ProgressBar';


const ModalWaitingFor = ({action}: {action: string}) => {
  return (
      <div className="modal-deploying-content">
        <div className="modal-deploying-content-loader">
          <Spinner />
        </div>
        <h1 className="modal-deploying-title">{action}</h1>
        <ProgressBar />
      </div>
  );
};

export default ModalWaitingFor;
