import React from 'react';
import ProgressBar from '../../common/ProgressBar';

interface BackupCodesLoaderProps {
  title: string;
}

const BackupCodesLoader = ({title}: BackupCodesLoaderProps) => (
  <>
    <p className="backup-codes-loader-text">{title}</p>
    <div className="backup-codes-loader-wrapper">
      <ProgressBar className="backup-codes-loader" />
    </div>
  </>
);

export default BackupCodesLoader;
