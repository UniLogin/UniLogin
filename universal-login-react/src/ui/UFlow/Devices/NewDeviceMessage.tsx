import React from 'react';

interface NewDeviceMessageProps {
  onClick: () => void;
}

export const NewDeviceMessage = ({onClick}: NewDeviceMessageProps) => (
  <div className="devices-message">
    <div className="devices-message-row">
      <div className="devices-message-desription">
        <h3 className="devices-message-title">New device(s) want to connect this account</h3>
        <p className="devices-message-text">We noticed login from an unrecognized device, we ask you for your login code before you can access your account.</p>
      </div>
      <button onClick={onClick} className="devices-message-button">Manage</button>
    </div>
  </div>
);
