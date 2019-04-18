import React from 'react';
import {Notification} from '@universal-login/commons';


interface NotificationConnectionProps {
  data: Notification;
  device: string;
  confirm: (key: string) => void;
  reject: (key: string) => void;
}

const NotificationConnection = ({data, device, confirm, reject}: NotificationConnectionProps) => {
  return(
    <div className="notifications-item">
      <div className={`notification-connected ${device}`}>
        <h3 className="notification-title">Connected ({data.deviceInfo.os})</h3>
        <p className="notification-connected-id"><span>Devices ID:</span> {data.id}</p>
        <div className="notification-buttons-row">
          <button onClick={() => reject(data.key)} className="notification-reject-btn">Reject</button>
          <button onClick={() => confirm(data.key)} className="btn btn-secondary btn-confirm">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationConnection;
