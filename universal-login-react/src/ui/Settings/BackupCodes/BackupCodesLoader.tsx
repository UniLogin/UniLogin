import React from 'react';
import ProgressBar from '../../commons/ProgressBar';

interface BackupCodesLoaderProps {
  title: string;
}

export const BackupCodesLoader = ({title}: BackupCodesLoaderProps) => (
  <>
    <p className="backup-text">{title}</p>
    <div className="backup-codes-loader-wrapper">
      <ProgressBar className="backup-codes-loader" />
    </div>
  </>
);

export default BackupCodesLoader;
