import React from 'react';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';
import {Button} from '../commons/Button';
import Ether from './../assets/icons/ether.svg';
import Card from './../assets/icons/card.svg';
import Bank from './../assets/icons/bank.svg';
import './../styles/topUpModalDefaults.css';

interface TopUpChooseProps {
  onMethodChoose: (topUpModalType: TopUpComponentType) => void;
  className?: string;
}

export const TopUpChoose = ({onMethodChoose, className}: TopUpChooseProps) => {
  return(
    <div className={`topup ${className ? className : 'universal-login-topup'}`}>
      <h2 className="topup-title">Choose a top-up method</h2>
      <Button
        id={'crypto'}
        image={Ether}
        title="Deposit crypto"
        text="Free-Deposit ETH or DAI"
        onClick={() => onMethodChoose(TopUpComponentType.crypto)}
      />
      <Button
        id={'creditcard'}
        image={Card}
        title="Buy Crypto with CC"
        text="5%-Buy instantly using your card"
        onClick={() => onMethodChoose(TopUpComponentType.creditcard)}
      />
      <Button
        id={'bank'}
        image={Bank}
        title="Buy crypto with bank wire"
        text="2%-Buy crypto"
        onClick={() => onMethodChoose(TopUpComponentType.bank)}
      />
    </div>
  );
};

export default TopUpChoose;
