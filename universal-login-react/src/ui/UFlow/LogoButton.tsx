import React from 'react';
import {Dashboard, DashboardProps} from './Dashboard';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

export interface LogoButtonProps extends DashboardProps {
  className?: string;
}

export const LogoButton = ({className, ...rest}: LogoButtonProps) => {
  return (
    <div className={getStyleForTopLevelComponent(className)}>
      <Dashboard {...rest} />
    </div>
  );
};
