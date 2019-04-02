import React from 'react';
import Spinner from '../../Login/Spinner';

interface BackupCodesLoaderProps {
  title: string;
}

const BackupCodesLoader = ({title}: BackupCodesLoaderProps) => (
  <div className="backup-codes-loader">
    <Spinner dotClassName="backup-codes-loader-dot"/>
    <p className="backup-codes-loader-text">{title}</p>
  </div>
);

export default BackupCodesLoader;
