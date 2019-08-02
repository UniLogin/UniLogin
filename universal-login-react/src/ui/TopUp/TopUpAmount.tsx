import React, {useState} from 'react';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';
import {Button} from '../commons/Button';
import {Input} from '../commons/Input';
import './../styles/topUpModalDefaults.css';

interface TopUpAmountProps {
  onNextClick: (amount: string) => void;
  topUpClassName?: string;
}

export const TopUpAmount = ({onNextClick, topUpClassName}: TopUpAmountProps) => {
  const [amount, setAmount] = useState<string>('');
  return(
    <div className={`topup ${topUpClassName ? topUpClassName : 'universal-login-topup'}`}>
      <h2 className="topup-title">Type amount of ether you want to buy</h2>
      <div className="topup-amount-input">
        <Input id={"topup-amount"} onChange={(event) => setAmount(event.target.value)}/>
        <button onClick={() => onNextClick(amount)} className="topup-amount">Next</button>
      </div>
    </div>
  );
};

export default TopUpAmount;
