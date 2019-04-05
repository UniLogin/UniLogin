import React from 'react';

interface NotificationConnectionProps {
  data: {
    id: number,
    deviceId: number,
    device: string,
  };
  removeNotification: (id: number) => void;
}

const NotificationConnection = ({data, removeNotification}: NotificationConnectionProps) => {
  return(
    <div className="notifications-item">
      <div className={`notification-connected ${data.device}`}>
        <h3 className="notification-title">Connected</h3>
        <p className="notification-connected-id"><span>Devices ID:</span> {data.deviceId}</p>
        <div className="notification-buttons-row">
          <button className="notification-reject-btn">Reject</button>
          <button onClick={() => removeNotification(data.id)} className="btn btn-secondary btn-confirm">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationConnection;
