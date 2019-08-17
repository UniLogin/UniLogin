import React from 'react';
import ProgressBar from '../commons/ProgressBar';

export const TransferInProgress = () => (
  <div className="udashboard-progress">
    <p className="udashboard-progress-text">Transferring funds</p>
    <ProgressBar />
  </div>
);
