import {utils} from 'ethers';

export const normalizeBigNumber = (bigNumber: utils.BigNumber) => utils.bigNumberify(bigNumber.toString());

export const bigNumberifyDecimal = (value: string) => utils.bigNumberify(value.split('.')[0]);
