
import React from 'react';
import {LocalizationConfig, SafelloConfig} from '@unilogin/commons';
import {useClassFor} from '../../utils/classFor';
import '../../styles/base/iframes/safello.sass';

interface SafelloProps {
  localizationConfig: LocalizationConfig;
  safelloConfig: SafelloConfig;
  crypto: string;
  contractAddress: string;
}

export const Safello = (props: SafelloProps) => {
  const {localizationConfig, crypto, contractAddress, safelloConfig} = props;
  const url = getSafelloUrl(localizationConfig, safelloConfig, crypto, contractAddress);
  return (
    <iframe
      className={`${useClassFor('safello-iframe')}`}
      id="safello-iframe"
      src={url}
      width="500px"
      height="650px"
      sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts allow-popups"
    />
  );
};

export const getSafelloUrl = (
  localizationConfig: LocalizationConfig,
  safelloConfig: SafelloConfig,
  crypto: string,
  contractAddress: string,
) => `${safelloConfig.baseAddress}?` +
    `appId=${safelloConfig.appId}` +
    '&border=true' +
    `&address-helper=${safelloConfig.addressHelper}` +
    `&lang=${localizationConfig.language}` +
    `&country=${localizationConfig.country}` +
    `&crypto=${crypto}` +
    `&address=${contractAddress}`;

export default SafelloProps;
