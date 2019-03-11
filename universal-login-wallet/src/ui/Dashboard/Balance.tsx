import React from 'react';

interface BalanceProps {
  className?: string;
}

const Balance = ({className} : BalanceProps) => {
  return(
    <section className={`${className ? className : ''}`}>
      <h2 className="balance-title">Your balance</h2>
      <div className="balance-box">
        <p className="balance-amount"><span className="balance-amount-highlighted">$1000,00</span>00 0000 2334</p>
      </div>
    </section>
  );
};

export default Balance;
