import React from 'react';
import NotificationConnection from './NotificationConnection';
import NotificationTransaction from './NotificationTransaction';

const Notifications = () => {
  const placeholderTransactionData = {
    deviceId: 1234567890,
    amount: 300,
    currency: 'DAI',
    address: '0xf902fd8B2AEE76AE81bBA106d667',
    fee: 0.5,
    gasPrice: 123.45,
    gasToken: 234,
    gasLimit: 2345.54,
  };

  return (
    <div className="subscreen">
      <h2 className="subscreen-title">Notifications:</h2>
      <ul className="notifications-list">
        <NotificationConnection device="mobile" id={123456789} />
        <NotificationTransaction data={placeholderTransactionData}/>
        <NotificationConnection device="computer" id={123456789} />
        <NotificationConnection device="tablet" id={123456789} />
        <NotificationConnection device="mobile" id={123456789} />
      </ul>
    </div>
  );
};

export default Notifications;
