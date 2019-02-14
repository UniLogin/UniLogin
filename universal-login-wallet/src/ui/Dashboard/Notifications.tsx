import React from 'react';
import bell from './../../assets/bell.svg';

const Notifications = () => (
  <button className="notifications active">
    <img className="notifications-icon" src={bell} />
  </button>
);

export default Notifications;
