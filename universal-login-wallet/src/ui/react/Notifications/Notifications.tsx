import React, { useState, useEffect } from 'react';
import NotificationConnection from './NotificationConnection';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useServices } from '../../hooks';
import {Notification} from '@universal-login/commons';
import {transactionDetails} from '../../../config/TransactionDetails';

const Notifications = () => {
  const {walletService, sdk} = useServices();
  const [notifications, setNotifications] = useState([] as Notification[]);
  const {contractAddress, privateKey} = walletService.applicationWallet!;

  useEffect(() => sdk.subscribeAuthorisations(contractAddress, privateKey, setNotifications), []);

  const confirmRequest = (publicKey : string) => sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails);

  const rejectRequest = (publicKey: string) => sdk.denyRequest(contractAddress, publicKey, privateKey);

  return (
    <div className="subscreen">
      <h2 className="subscreen-title">Connection requests:</h2>
      <TransitionGroup className="notifications-list">
        {notifications.map((notification: Notification) =>
          <CSSTransition key={notification.id} timeout={200} classNames="move" >
              <NotificationConnection
                confirm={confirmRequest}
                reject={rejectRequest}
                data={notification}
                device="mobile"
              />
            </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};


export default Notifications;
