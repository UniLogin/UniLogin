import React from 'react';
import {WyreConfig} from '@unilogin/commons';
import {ModalWrapper} from '../../..';
import {WaitingForWyre} from '../../commons/WaitingForWyre';

interface WyreProps {
  address: string;
  currency: string;
  config: WyreConfig;
  onBack: () => void;
}

export const Wyre = ({address, currency, config, onBack}: WyreProps) => {
  const url = getWyreUrl(address, currency, config);
  const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=470,height=630,left=100,top=100`;
  window.open(url, 'wyre', params);

  return <ModalWrapper >
    <WaitingForWyre onBack={onBack}/>
  </ModalWrapper>;
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
