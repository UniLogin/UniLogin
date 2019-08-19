import React from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

const ProfileHeader = (props) => (
  <div className="row align-items-center">
    <Blockies seed={props.address} size={8} scale={6} />
    <div>
      <p className="user-id user-id-header">{props.userId}</p>
      <p className="wallet-address wallet-address-header">{props.address}</p>
    </div>
  </div>
);

ProfileHeader.propTypes = {
  userIco: PropTypes.object,
  userId: PropTypes.string,
  address: PropTypes.string
};

export default ProfileHeader;
