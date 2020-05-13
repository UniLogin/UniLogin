import React from 'react';
import {Dashboard, DashboardProps} from './Dashboard';

export const LogoButton = ({...rest}: DashboardProps) => {
  return (
    <div className='logo-button'>
      <Dashboard {...rest} />
    </div>
  );
};
