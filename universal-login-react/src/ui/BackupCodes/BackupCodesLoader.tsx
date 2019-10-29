import React from 'react';
import ProgressBar from '../commons/ProgressBar';

interface BackupCodesLoaderProps {
  title: string;
}

export const BackupCodesLoader = ({title}: BackupCodesLoaderProps) => (
  <>
    <p className="backup-loader-label">{title}</p>
    <ProgressBar className="backup-loader" />
    <p className="backup-loader-info">
      This might take a couple of minutes.
      <br />
      Please <strong>don't close</strong> the window.
    </p>
  </>
);

export default BackupCodesLoader;
