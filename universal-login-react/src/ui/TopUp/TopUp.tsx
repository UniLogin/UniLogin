import React from 'react';
import {TopUpClassName} from '../../core/models/TopUpClassName';
import {TopUpChoice} from './TopUpChoice';
import {TopUpAction} from '../../core/models/TopUpAction';

interface TopUpProps {
  topUpClassName: TopUpClassName;
  actions: TopUpAction[];
}

export const TopUp = ({topUpClassName, actions}: TopUpProps) => (
  <div className={`top-up-${topUpClassName}`}>
    {actions.includes(TopUpAction.crypto) && <TopUpChoice name="Crypto"/>}
    {actions.includes(TopUpAction.bank) && <TopUpChoice name="Bank"/>}
    {actions.includes(TopUpAction.creditcard) && <TopUpChoice name="Credit Card"/>}
  </div>
);
