import React from 'react';
import logo from '../../assets/logo.svg';
import { useServices } from '../../hooks';

function Sidebar() {
  const {modalService} = useServices();
  return (
    <div className="sidebar">
      <img src={logo} />
      <ul className="sidebar-list">
        <li className="sidebar-button sidebar-list-item">
          <button
            onClick={() => modalService.showModal('request')}
            className="request-funds-button"
          />
        </li>
        <li className="sidebar-button sidebar-list-item">
          <button
            onClick={() => modalService.showModal('transfer')}
            className="transfer-funds-button"
          />
        </li>
        <li className="sidebar-button sidebar-list-item">
          <button
            onClick={() => modalService.showModal('invitation')}
            className="send-invitation-button"
          />
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
