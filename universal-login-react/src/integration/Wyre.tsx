import React from 'react';
import {WyreConfig} from '@universal-login/commons';

interface WyreProps {
  address: string;
  currency: string;
  config: WyreConfig;
}

export const Wyre = ({address, currency, config}: WyreProps) => {
  const url = getWyreUrl(address, currency, config);
  return (
    <iframe
      src={url}
      width="100%"
      height="700px"
      sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts allow-popups"
      style={{border: 'none', maxWidth: '100%', display: 'block', marginLeft: 'auto', marginRight: 'auto'}}
    />
  );
};

export const getWyreUrl = (address: string, currency: string, config: WyreConfig) =>
  `${config.wyreUrl}` +
  `?destCurrency=${currency}` +
  `&dest=${address}` +
  `&paymentMethod=${config.paymentMethod}`;
