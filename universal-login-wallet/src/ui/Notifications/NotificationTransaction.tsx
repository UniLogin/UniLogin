import React from 'react';
import arrowIcon from './../../assets/icons/arrow.svg';
import infoIcon from './../../assets/icons/info.svg';

interface NotificationTransactionProps {
  data: {
    amount: number,
    fee: number,
    gasPrice: number,
    gasLimit: number,
    gasToken: number,
    currency: string,
    address: string,
  };
}

const NotificationTransaction = ({data}: NotificationTransactionProps) => {
  return (
    <li className="notifications-item">
      <div className="notification-transaction">
        <h3 className="notification-title">Transaction</h3>
        <div className="notification-transaction-row">
          <p className="notification-transaction-amount">{data.amount}</p>
          <p className="notification-currency-name">{data.currency}</p>
          <img className="notification-transaction-icon" src={arrowIcon} alt="arrow"/>
          <div className="notification-transaction-address">{data.address}</div>
        </div>
        <div className="notification-transaction-fee">
          <p className="notification-transaction-fee-label">Transaction fee:</p>
          <p className="notification-transaction-fee-amount">{data.fee}$</p>
          <div className="tooltip-wrapper">
            <img src={infoIcon} alt="info"/>
            <div className="tooltip">
              <div className="tooltip-row">
                <p className="tooltip-label">Gas Price</p>
                <p className="tooltip-value">{data.gasPrice}</p>
              </div>
              <div className="tooltip-row">
                <p className="tooltip-label">Gas Price</p>
                <p className="tooltip-value">{data.gasPrice}</p>
              </div>
              <div className="tooltip-row">
                <p className="tooltip-label">Gas Price</p>
                <p className="tooltip-value">{data.gasPrice}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="notification-buttons-row">
          <button className="notification-reject-btn">Reject</button>
          <button className="btn btn-secondary btn-confirm">Confirm</button>
        </div>
      </div>
    </li>
  );
};

export default NotificationTransaction;
