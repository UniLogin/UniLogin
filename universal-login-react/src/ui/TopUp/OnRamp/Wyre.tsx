import React from 'react';
import {WyreConfig} from '@unilogin/commons';
import {WaitingForWyre} from '../../commons/WaitingForWyre';
import {getWindowCenterForPopUp} from '../../commons/getWindowCenterForPopUp';

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
    const center = getWindowCenterForPopUp(width, height);
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=${width},height=${height},top=${center.top}, left=${center.left}`;
    return window.open(url, 'wyre', params);
  }

  openPopUp();
  if (isDeployed) {
    onBack();
    return null;
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
