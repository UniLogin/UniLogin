import React from 'react';

interface NotificationConnectionProps {
  id: number;
  device: string;
}

const NotificationConnection = ({id, device}: NotificationConnectionProps) => {
  return(
    <li className="notifications-item">
      <div className={`notification-connected ${device}`}>
        <h3 className="notification-title">Connected</h3>
        <p className="notification-connected-id"><span>Devices ID:</span> {id}</p>
        <div className="notification-buttons-row">
          <button className="notification-reject-btn">Reject</button>
          <button className="btn-secondary">Confirm</button>
        </div>
      </div>
    </li>
  );
};

export default NotificationConnection;
