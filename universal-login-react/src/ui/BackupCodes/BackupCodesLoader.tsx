import React from 'react';
import ProgressBar from '../commons/ProgressBar';

interface BackupCodesLoaderProps {
  title: string;
}

export const BackupCodesLoader = ({title}: BackupCodesLoaderProps) => (
  <div className="backup-loader-wrapper">
    <p className="backup-loader-label">{title}</p>
    <ProgressBar/>
    <p className="backup-loader-info">
      This might take a couple of minutes.
      <br />
      Please <strong>do not close</strong> the window.
    </p>
  </div>
);

export default BackupCodesLoader;
