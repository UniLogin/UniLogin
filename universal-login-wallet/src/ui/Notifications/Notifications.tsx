import React, { useState } from 'react';
import NotificationConnection from './NotificationConnection';
import NotificationTransaction from './NotificationTransaction';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const Notifications = () => {
  const [notifications, setNotifications] = useState(placeholderTransactionData);

  const removeNotification = (id: number) => {
    const filteredNotifications = notifications.filter((notification: any) => (
      notification.id !== id
    ));

    setNotifications(filteredNotifications);
  };

  return (
    <div className="subscreen">
      <h2 className="subscreen-title">Notifications:</h2>
        <TransitionGroup className="notifications-list">
          {notifications.map((notification: any) => {
            if (notification.type === 'transaction') {
              return (
                <CSSTransition key={notification.id} timeout={200} classNames="move" >
                  <NotificationTransaction key={notification.id} removeNotification={removeNotification} data={notification}/>
                </CSSTransition>
              );
            } else {
              return (
                <CSSTransition key={notification.id} timeout={200} classNames="move" >
                  <NotificationConnection removeNotification={removeNotification} data={notification} />
                </CSSTransition>
              );
            }
          })}
        </TransitionGroup>
    </div>
  );
};

export default Notifications;

const placeholderTransactionData = [
  {
    id: 1,
    type: 'connection',
    device: 'mobile',
    deviceId: 123456,
  },
  {
    id: 2,
    type: 'transaction',
    amount: 300,
    currency: 'DAI',
    address: '0xf902fd8B2AEE76AE81bBA106d667',
    fee: 0.5,
    gasPrice: 123.45,
    gasToken: 234,
    gasLimit: 2345.54,
  },
  {
    id: 3,
    type: 'connection',
    device: 'tablet',
    deviceId: 1234567,
  },
  {
    id: 4,
    type: 'connection',
    device: 'mobile',
    deviceId: 12345678,
  }
];
