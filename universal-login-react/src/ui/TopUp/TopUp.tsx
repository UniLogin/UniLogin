import React from 'react';
import {TopUpChoice} from './TopUpChoice';
import {TopUpAction} from '../../core/models/TopUpAction';

interface TopUpProps {
  actions: TopUpAction[];
}

export const TopUp = ({actions}: TopUpProps) => (
  <div>
    {actions.includes(TopUpAction.crypto) && <TopUpChoice name="Crypto"/>}
    {actions.includes(TopUpAction.bank) && <TopUpChoice name="Bank"/>}
    {actions.includes(TopUpAction.creditcard) && <TopUpChoice name="Credit Card"/>}
  </div>
);
