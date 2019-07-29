import React from 'react';
import {TopUp} from '../TopUp/TopUp';
import {ModalWrapper} from './ModalWrapper';
import {createKeyPair} from '@universal-login/commons';
import {useServices} from '../../core/services/useServices';
import {useSubscription} from '../../core/services/useSubscription';

const Modal = () => {
  const {modalService} = useServices();
  const openModal = useSubscription(modalService);
  switch (openModal) {
    case 'topUpAccount':
      return (
        <ModalWrapper isVisible modalPosition="bottom">
          <TopUp
            contractAddress={createKeyPair().publicKey}
            onRampConfig={{safello: {
              appId: '1234-5678',
              baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
              addressHelper: true
            }}}
          />
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export default Modal;
