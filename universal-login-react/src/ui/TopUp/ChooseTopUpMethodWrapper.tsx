import React, {ReactNode} from 'react';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {TopUpMethod} from '../../core/models/TopUpMethod';

interface ChooseTopUpMethodWrapperProps {
  children: ReactNode;
  className?: string;
  topUpMethod?: TopUpMethod;
};

export const ChooseTopUpMethodWrapper = ({children, className, topUpMethod}: ChooseTopUpMethodWrapperProps) => (
  <div className="universal-login-topup">
    <div className={`${getStyleForTopLevelComponent(className)}`}>
      <div className={`top-up ${topUpMethod ? 'method-selected' : ''}`}>
        {children}
      </div>
    </div>
  </div>
);
