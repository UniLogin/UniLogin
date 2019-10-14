
import React from 'react';
import {Nav, NavProps} from '../commons/Nav';

export interface UHeaderProps extends NavProps {
  ensName: string;
}

export const UHeader = ({activeTab, setActiveTab, ensName}: UHeaderProps) => {

  return (
    <div className="udashboard-header">
      <div className="udashboard-header-nav">
        <Nav activeTab={activeTab} setActiveTab={setActiveTab}/>
      </div>
      <p className="udashboard-ens">{ensName}</p>
    </div>
  );
};
