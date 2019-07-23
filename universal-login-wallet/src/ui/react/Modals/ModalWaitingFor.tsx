import React from 'react';
import {ProgressBar, Spinner} from '@universal-login/react';

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
