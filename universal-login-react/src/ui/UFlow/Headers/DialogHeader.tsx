import React from 'react';
import {Nav} from '../../commons/Nav';

export interface DialogHeaderProps {
  ensName: string;
}

export const DialogHeader = ({ensName}: DialogHeaderProps) => {

  return (
    <div className="udashboard-header">
      <div className="udashboard-header-nav">
        <Nav />
      </div>
      <p className="udashboard-ens">{ensName}</p>
    </div>
  );
};
