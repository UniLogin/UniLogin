
import React from 'react';
import {LocalizationConfig} from '@universal-login/commons';

interface Safello {
  localizationConfig: LocalizationConfig;
  crypto: string;
  contractAddress: string;
}

export const Safello = (props: Safello) => {
  const {localizationConfig, crypto, contractAddress} = props;
  const url = getSafelloUrl(localizationConfig, crypto, contractAddress);
  return (
    <iframe
      src={url}
      width="500px"
      height="650px"
      sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts allow-popups"
      style={{ border: 'none', maxWidth: '100%' }}
    />
  );
};

export const getSafelloUrl = (localizationConfig: LocalizationConfig, crypto: string, contractAddress: string) => 'https://app.s4f3.io/sdk/quickbuy.html?appId=1234-5678' +
  '&border=true' +
  '&address-helper=true' +
  `&lang=${localizationConfig.language}` +
  `&country=${localizationConfig.country}` +
  `&crypto=${crypto}` +
  `&address=${contractAddress}`;

export default Safello;
