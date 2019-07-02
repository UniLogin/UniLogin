import React from 'react';
import Spinner from '../Login/Spinner';
import ProgressBar from '../common/ProgressBar';


const ModalWaitingForDeploy = () => {
  return (
      <div className="modal-deploying-content">
        <div className="modal-deploying-content-loader">
          <Spinner />
        </div>
        <h1 className="modal-deploying-title">Creating wallet</h1>
        <ProgressBar />
      </div>
  );
};

export default ModalWaitingForDeploy;
