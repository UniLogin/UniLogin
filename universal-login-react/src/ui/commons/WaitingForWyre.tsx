import React from 'react';
import {useClassFor} from '../utils/classFor';
import {WaitingFor} from './WaitingFor';

interface WaitingForWyreProps{
  onBack: () => void;
}

export const WaitingForWyre = ({onBack}: WaitingForWyreProps) => {
  return <div className={useClassFor('waitingfortransaction')}>
    <WaitingFor
      action = 'Waiting for Wyre transaction'
      description = 'We have opened the Wyre in a new window. If you complete a transaction, this window will update automatically. If you want to change provider, you can click the button and go back to selection'
    />
    <button onClick={onBack} className="unilogin-component-pay-btn unilogin-theme-unilogin">
      Go back
    </button>
  </div>;
};
