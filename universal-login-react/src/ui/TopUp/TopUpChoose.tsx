import React from 'react';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';
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
        image={Ether}
        title="Deposit crypto"
        text="Free-Deposit ETH or DAI"
        onClick={() => onMethodChoose(TopUpComponentType.crypto)}
      />
      <Button
        image={Card}
        title="Buy Crypto with CC"
        text="5%-Buy instantly using your card"
        onClick={() => onMethodChoose(TopUpComponentType.creditcard)}
      />
      <Button
        image={Bank}
        title="Buy crypto with bank wire"
        text="2%-Buy crypto"
        onClick={() => onMethodChoose(TopUpComponentType.bank)}
      />
    </div>
  );
};

export default TopUpChoose;

interface ButtonProps {
  image: string;
  title: string;
  text: string;
  onClick: () => void;
}

const Button = ({ image, title, text, onClick }: ButtonProps) => (
  <button onClick={onClick} className="topup-btn">
    <img src={image} alt="Ethereum logo" className="topup-btn-img"/>
    <div>
      <h3 className="topup-btn-title">{title}</h3>
      <p className="topup-btn-text">{text}</p>
    </div>
  </button>
);
