import React, { useState, useEffect } from 'react';
import NotificationConnection from './NotificationConnection';
import NotificationTransaction from './NotificationTransaction';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useServices } from '../../hooks';
import {Notification} from '@universal-login/commons';

const Notifications = () => {
  const {notificationService} = useServices();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => notificationService.subscribe(setNotifications));

  const removeNotification = (id: number, callback: Function) => {
    const notification: any = notifications.find((notification: any) => (
      notification.id === id
    ))!;
    if (notification){
      callback(notification.walletContractAddress, notification.key);
    }
  };

  const confirmRequest = (id: number) => {
    removeNotification(id,  (walletContractAddress : string, key : string) => notificationService.confirm(key));
  };

  const rejectRequest = (id: number) => {
    removeNotification(id, async (walletContractAddress : string, key : string) => { await notificationService.reject(walletContractAddress, key); });
  };

  return (
    <div className="subscreen">
      <h2 className="subscreen-title">Notifications:</h2>
      <TransitionGroup className="notifications-list">
        {notifications.map((notification: any) => {
          if (notification.type === 'transaction') {
            return (
              <CSSTransition key={notification.id} timeout={200} classNames="move" >
                <NotificationTransaction key={notification.id} removeNotification={() => () => {}} data={notification}/>
              </CSSTransition>
            );
          } else {
            return (
              <CSSTransition key={notification.id} timeout={200} classNames="move" >
                <NotificationConnection
                  confirm={confirmRequest}
                  reject={rejectRequest}
                  data={notification}
                  device="mobile"
                />
              </CSSTransition>
            );
          }
        })}
      </TransitionGroup>
    </div>
  );
};

export default Notifications;
