import React from 'react';
import {InputLabel} from '@universal-login/react';
import InputWithButton from '../common/InputWithButton';

const addressPlaceholder = '0xf902fd8B2AEE76AE81bBA106d667';

const ModalInvitation = () => (
  <div className="modal-body invitation-modal">
    <h2 className="modal-title invitation-modal-title">Send invite link</h2>
    <InputLabel htmlFor="link">Link</InputLabel>
    <InputWithButton
      id="link"
      value={addressPlaceholder}
      autoFocus
    />
  </div>
);

export default ModalInvitation;

