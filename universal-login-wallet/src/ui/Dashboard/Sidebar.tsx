import React from 'react';
import logo from '../../assets/logo.svg';

const Sidebar = ({emitter}: {emitter: any}) => (
  <div className="sidebar">
    <img src={logo} />
    <ul className="sidebar-list">
      <li className="sidebar-button sidebar-list-item">
        <button
          onClick={() => emitter.emit('showModal', 'request')}
          className="request-funds-button"
        />
      </li>
      <li className="sidebar-button sidebar-list-item">
        <button
          onClick={() => emitter.emit('showModal', 'transfer')}
          className="transfer-funds-button"
        />
      </li>
      <li className="sidebar-button sidebar-list-item">
        <button
          onClick={() => emitter.emit('showModal', 'invitation')}
          className="send-invitation-button"
        />
      </li>
    </ul>
  </div>
);

export default Sidebar;
