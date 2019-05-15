import React from 'react';
import {getSafelloUrl} from '../utils';
import {useServices} from '../../hooks';


const ModalSafello = () => {
  const {walletService} = useServices();
  return (
    <iframe
      src={getSafelloUrl(walletService.userWallet!.contractAddress)}
      width="500px"
      height="650px"
      sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts allow-popups"
      style={{ border: 'none', maxWidth: '100%' }}
    />
  );
};

export default ModalSafello;
