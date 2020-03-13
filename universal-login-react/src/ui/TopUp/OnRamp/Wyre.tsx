import React, {SyntheticEvent} from 'react';
import {WyreConfig} from '@unilogin/commons';

interface WyreProps {
  address: string;
  currency: string;
  config: WyreConfig;
  onCompleted?: () => void;
}

export const Wyre = ({address, currency, config, onCompleted}: WyreProps) => {
  const currentLocation = window.location.href;
  const url = getWyreUrl(address, currency, currentLocation, config);

  function onLoad(e: SyntheticEvent<HTMLIFrameElement>) {
    try {
      const location = e.currentTarget.contentDocument?.location
      if(!location) return

      onCompleted?.()
    } catch {}
  }

  return (
    <iframe
      src={url}
      style={{
        height: '100vh',
      }}
      onLoad={onLoad}
    />
  );
};

export const getWyreUrl = (address: string, currency: string, redirectUrl: string, config: WyreConfig) =>
  `${config.wyreUrl}` +
  `?destCurrency=${currency}` +
  `&dest=${address}` +
  `&paymentMethod=${config.paymentMethod}` +
  `&redirectUrl=${encodeURIComponent(redirectUrl)}`;
