import React, {SyntheticEvent} from 'react';
import {WyreConfig} from '@unilogin/commons';
import {parseQuery} from '../../../core/utils/parseQuery';
import {cast, asString, asNumber, asObject} from '@restless/sanitizers';

interface WyreProps {
  address: string;
  currency: string;
  config: WyreConfig;
  onCompleted?: (wyreSuccessParams?: WyreSuccessParams) => void;
  onClose?: () => void;
  onError?: () => void;
}

export const Wyre = ({address, currency, config, onCompleted, onClose, onError}: WyreProps) => {
  const currentLocation = window.location.href;
  const url = getWyreUrl(address, currency, currentLocation, config);

  function onLoad(e: SyntheticEvent<HTMLIFrameElement>) {
    try {
      const iframeLocation = e.currentTarget.contentDocument?.location;
      if (!iframeLocation) return;
      onRedirect(iframeLocation.search);
    } catch {}
  }

  function onRedirect(search: string) {
    if (search === '') {
      onClose?.();
      return;
    }
    try {
      const params = cast(parseQuery(search), asWyreSuccessParams);
      onCompleted?.(params);
    } catch {
      onError?.();
    }
  }

  return (
    <iframe
      src={url}
      onLoad={onLoad}
    />
  );
};

export const getWyreUrl = (address: string, currency: string, redirectUrl: string, config: WyreConfig) =>
  `${config.wyreUrl}` +
  `?destCurrency=${currency}` +
  `&dest=${address}` +
  `&redirectUrl=${encodeURIComponent(redirectUrl)}` +
  `&failureRedirectUrl=${encodeURIComponent(redirectUrl)}`;

export interface WyreSuccessParams {
  accountId: string;
  blockchainNetworkTx: string;
  dest: string;
  destAmount: number;
  orderId: string;
  transferId: string;
}

const asWyreSuccessParams = asObject<WyreSuccessParams>({
  accountId: asString,
  blockchainNetworkTx: asString,
  dest: asString,
  destAmount: asNumber,
  orderId: asString,
  transferId: asString,
});
