import React, {useState} from 'react';
import {ensure, isValidAmount} from '@universal-login/commons';
import {InvalidNumber} from '../../core/utils/errors';
import {Input} from '../commons/Input';
import './../styles/topUpModalDefaults.css';

interface TopUpAmountProps {
  onNextClick: (amount: string) => void;
  topUpClassName?: string;
}



export const TopUpAmount = ({onNextClick, topUpClassName}: TopUpAmountProps) => {
  const [amount, setAmount] = useState<string>('');

  const onClick = (amount: string) => {
    ensure(isValidAmount(amount), InvalidNumber, `'${amount}' is invalid number.`);
    onNextClick(amount);
  };

  return(
    <div className={`topup ${topUpClassName ? topUpClassName : 'universal-login-topup'}`}>
      <h2 className="topup-title">Type amount of ether you want to buy</h2>
      <Input id={'topup-amount-input'} className={'topup-amount'} onChange={event => setAmount(event.target.value)}/>
      <button onClick={() => onClick(amount)} className={'button-topup-amount'}>Next</button>
    </div>
  );
};

export default TopUpAmount;
