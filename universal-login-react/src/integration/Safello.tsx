
import React from 'react';
import {LocalizationConfig, SafelloConfig} from '@universal-login/commons';

interface Safello {
  localizationConfig: LocalizationConfig;
  safelloConfig: SafelloConfig;
  crypto: string;
  contractAddress: string;
}

export const Safello = (props: Safello) => {
  const {localizationConfig, crypto, contractAddress, safelloConfig} = props;
  const url = getSafelloUrl(localizationConfig, safelloConfig, crypto, contractAddress);
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

export const getSafelloUrl = (
    localizationConfig: LocalizationConfig,
    safelloConfig: SafelloConfig,
    crypto: string,
    contractAddress: string
  ) => `${safelloConfig.baseAddress}?` +
    `appId=${safelloConfig.appId}` +
    `&border=true` +
    `&address-helper=${safelloConfig.addressHelper}` +
    `&lang=${localizationConfig.language}` +
    `&country=${localizationConfig.country}` +
    `&crypto=${crypto}` +
    `&address=${contractAddress}`;

export default Safello;
