import React from 'react';
import Ether from './../assets/icons/ether.svg';
import Card from './../assets/icons/card.svg';
import Bank from './../assets/icons/bank.svg';
import './../styles/topUpModalDefaults.css';

export interface TopUpChooseModalProps {
  className?: string;
}

export const TopUpChooseModal = ({ className }: TopUpChooseModalProps) => (
  <div className={`topup ${className ? className : 'universal-login-topup'}`}>
    <h2 className="topup-title">Choose a top-up method</h2>
    <Button
      image={Ether}
      title="Deposit crypto"
      text="Free-Deposit ETH or DAI"
    />
    <Button
      image={Card}
      title="Buy Crypto with CC"
      text="5%-Buy instantly using your card"
    />
    <Button
      image={Bank}
      title="Buy crypto with bank wire"
      text="2%-Buy crypto"
    />
  </div>
);

interface ButtonProps {
  image: string;
  title: string;
  text: string;
}

const Button = ({ image, title, text }: ButtonProps) => (
  <button className="topup-btn">
    <img src={image} alt="Ethereum logo" className="topup-btn-img"/>
    <div>
      <h3 className="topup-btn-title">{title}</h3>
      <p className="topup-btn-text">{text}</p>
    </div>
  </button>
)
