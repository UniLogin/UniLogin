import React, {useEffect} from 'react';
import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {useClassFor} from '../../utils/classFor';
import {GasPriceProps} from './GasPrice';

const GAS_PRICE_FOR_NO_REFUND = {
  gasPrice: utils.bigNumberify('0'),
  gasToken: ETHER_NATIVE_TOKEN.address,
};

type NoRefundGasPriceProps = Pick<GasPriceProps, 'sdk' | 'onGasParametersChanged'>;

export const NoRefundGasPrice = ({onGasParametersChanged, sdk}: NoRefundGasPriceProps) => {
  useEffect(() => {
    if (sdk.isRefundPaid()) {
      onGasParametersChanged(GAS_PRICE_FOR_NO_REFUND);
    }
  }, []);

  return <div className={useClassFor('gas-price')} />;
};
