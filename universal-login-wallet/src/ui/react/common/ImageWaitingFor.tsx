import React from 'react';
import AvatarPending1x from './../../assets/illustrations/avatatPending@1x.png';
import AvatarPending2x from './../../assets/illustrations/avatatPending@2x.png';

export const ImageWaitingFor = () => {
  return (
    <img
      className="modal-avatar-pending"
      src={AvatarPending1x}
      srcSet={AvatarPending2x}
      alt="pending"
    />
  );
};
