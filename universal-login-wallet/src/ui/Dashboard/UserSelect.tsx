import React, {useState} from 'react';
import avatar from './../../assets/avatar.svg';

const UserSelect = () => {
  const [visible, setVisibility] = useState(false);
  const toggle = () => setVisibility(visible => !visible);

  return (
    <div className="user-select">
      <button onClick={toggle} className="user-select-button">
        <img className="user-select-avatar" src={avatar} alt="avatar"/>
        <div>
          <p className="user-select-name">Liam Riley</p>
          <p className="user-select-nickname">liam.universal-id.eth</p>
        </div>
      </button>
      { visible ?
      <ul className="user-select-list">
        <li className="user-select-list-item">liam.universal-id.eth</li>
        <li className="user-select-list-item">liam.statusapp.eth</li>
        <li className="user-select-list-item">liam.universal-id.eth</li>
      </ul>
      : null
      }
    </div>
  );
};

export default UserSelect;
