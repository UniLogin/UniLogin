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
    <div className={useClassFor('footer-section')}>
      <button onClick={onBack} className={useClassFor('pay-btn')}>
        Go back
      </button>
    </div>
  </div>;
};
