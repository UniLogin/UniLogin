import React from 'react';
import ProgressBar from '../commons/ProgressBar';

interface BackupCodesLoaderProps {
  title: string;
}

export const BackupCodesLoader = ({title}: BackupCodesLoaderProps) => (
  <>
    <p className="backup-loader-label">{title}</p>
    <ProgressBar className="backup-loader" />
  </>
);

export default BackupCodesLoader;
