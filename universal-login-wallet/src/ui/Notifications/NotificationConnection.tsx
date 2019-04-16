import React from 'react';
import {Notification} from '@universal-login/commons';


interface NotificationConnectionProps {
  data: any;
  device: string;
  confirm: (id: number) => void;
  reject: (id: number) => void;
}

const NotificationConnection = ({data, device, confirm, reject}: NotificationConnectionProps) => {
  return(
    <div className="notifications-item">
      <div className={`notification-connected ${device}`}>
        <h3 className="notification-title">Connected ({data.deviceInfo.os})</h3>
        <p className="notification-connected-id"><span>Devices ID:</span> {data.id}</p>
        <div className="notification-buttons-row">
          <button onClick={() => reject(data.id)} className="notification-reject-btn">Reject</button>
          <button onClick={() => confirm(data.id)} className="btn btn-secondary btn-confirm">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationConnection;
