import React from 'react';
import PropTypes from 'prop-types';

const UserInfoView = props => (
  <div className="row align-items-center">
    <img
      className="user-avatar user-avatar-header"
      src={props.userIco}
      alt="Avatar"
    />
    <div>
      <p className="user-id user-id-header">{props.userId}</p>
      <p className="wallet-address wallet-address-header">{props.wallet}</p>
    </div>
  </div>
);

UserInfoView.propTypes = {
  userIco: PropTypes.string,
  userId: PropTypes.string,
  wallet: PropTypes.string
};

export default UserInfoView;
