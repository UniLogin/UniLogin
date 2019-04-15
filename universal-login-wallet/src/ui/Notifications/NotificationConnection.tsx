import React from 'react';

interface NotificationConnectionProps {
  data: {
    id: number,
    deviceId: number,
    device: string,
    deviceInfo: string,
  };
  confirm: (id: number) => void;
  reject: (id: number) => void;
}

const NotificationConnection = ({data, confirm, reject}: NotificationConnectionProps) => {
  return(
    <div className="notifications-item">
      <div className={`notification-connected ${data.device}`}>
        <h3 className="notification-title">Connected ({data.deviceInfo})</h3>
        <p className="notification-connected-id"><span>Devices ID:</span> {data.deviceId}</p>
        <div className="notification-buttons-row">
          <button onClick={() => reject(data.id)} className="notification-reject-btn">Reject</button>
          <button onClick={() => confirm(data.id)} className="btn btn-secondary btn-confirm">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationConnection;
