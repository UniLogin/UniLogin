import {utils} from 'ethers';

export const multiplyBy150Percent = (numberToMultiply: utils.BigNumberish) => utils.bigNumberify(numberToMultiply.toString()).mul(3).div(2).toString();
