import React from 'react';
import Ether from './../assets/icons/ether.svg'
import Card from './../assets/icons/card.svg'
import Bank from './../assets/icons/bank.svg'

export const TopUpChooseModal = () => (
  <div className="topup">
    <h2 className="topup-title">Choose a top-up method</h2>
    <button className="topup-btn">
      <img src={Ether} alt="Ethereum logo" className="topup-btn-img"/>
      <h3 className="topup-btn-title">Deposit crypto</h3>
      <p className="topup-btn-text">Free-Deposit ETH or DAI</p>
    </button>
    <button className="topup-btn">
      <img src={Card} alt="card" className="topup-btn-img"/>
      <h3 className="topup-btn-title">Buy Crypto with CC</h3>
      <p className="topup-btn-text">5%-Buy instantly using your card</p>
    </button>
    <button className="bank">
      <img src={Bank} alt="Ethereum logo" className="topup-btn-img"/>
      <h3 className="topup-btn-title">Buy crypto with bank wire</h3>
      <p className="topup-btn-text">2%-Buy crypto</p>
    </button>
  </div>
);
