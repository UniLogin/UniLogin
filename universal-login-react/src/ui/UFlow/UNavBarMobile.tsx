import React from 'react';
import {Nav, NavProps} from '../commons/Nav';

export const UNavBarMobile = ({activeTab, setActiveTab}: NavProps) => {

  return (
    <div className="udashboard-navbar">
      <Nav activeTab={activeTab} setActiveTab={setActiveTab}/>
    </div>
  );
};
