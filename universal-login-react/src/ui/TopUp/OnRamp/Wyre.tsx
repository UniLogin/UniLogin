import React from 'react';
import {WyreConfig} from '@unilogin/commons';
import {WaitingForWyre} from '../../commons/WaitingForWyre';

interface WyreProps {
  address: string;
  currency: string;
  config: WyreConfig;
  onBack: () => void;
  isDeployed: boolean;
}

export const Wyre = ({address, currency, config, onBack, isDeployed}: WyreProps) => {
  function openPopUp() {
    const url = getWyreUrl(address, currency, config);
    const width = 470;
    const height = 630;
    const top = window.outerHeight / 2 + window.screenY - (height / 2);
    const left = window.outerWidth / 2 + window.screenX - (width / 2);
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=${width},height=${height},left=${left},top=${top}`;
    return window.open(url, 'wyre', params);
  }

  const wyreWindow = openPopUp();
  if (isDeployed) {
    if (wyreWindow) {
      const timer = setInterval(function () {
        if (wyreWindow.closed) {
          clearInterval(timer);
          onBack();
        }
      }, 500);
    }
    return <div></div>;
  }

  return <WaitingForWyre onBack={onBack}/>;
};

export const getWyreUrl = (address: string, currency: string, config: WyreConfig) =>
  `${config.wyreUrl}` +
  `?destCurrency=${currency}` +
  `&dest=${address}` +
  `&redirectUrl=${''}` +
  `&failureRedirectUrl=${''}` +
  `$paymentMethod=${'apple-pay'}`;

export interface WyreSuccessParams {
  accountId: string;
  blockchainNetworkTx: string;
  dest: string;
  destAmount: number;
  orderId: string;
  transferId: string;
}
