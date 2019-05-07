import React from 'react';
import { useServices } from '../../hooks';

const APP_ID = '2d67c38a-6ddf-469a-bd9f-876a770c2474';
const LANGUAGE = 'en';
const COUNTRY = 'other';
const CRYPTO = 'eth';

function getSafelloUrl(address: string) {
  return 'https://app.safello.com/sdk/quickbuy.html' +
    `?appId=${APP_ID}` +
    '&border=true' +
    '&address-helper=true' +
    `&lang=${LANGUAGE}` +
    `&country=${COUNTRY}` +
    `&crypto=${CRYPTO}` +
    `&address=${address}`;
}

const ModalSafello = () => {
  const { walletService } = useServices();

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
