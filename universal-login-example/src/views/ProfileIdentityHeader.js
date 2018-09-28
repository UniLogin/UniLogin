import React from "react";
import PropTypes from "prop-types";
import Blockies from "react-blockies";

const ProfileIdentityHeader = props => (
  <div className="row align-items-center">
    <Blockies seed={props.address.toLowerCase()} size={8} scale={6} />
    <div>
      <p className="user-id user-id-header">{props.userId}</p>
      <p className="wallet-address wallet-address-header">{props.address}</p>
    </div>
  </div>
);

ProfileIdentityHeader.propTypes = {
  userIco: PropTypes.string,
  userId: PropTypes.string,
  address: PropTypes.string
};

export default ProfileIdentityHeader;
