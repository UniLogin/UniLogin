import {utils} from 'ethers';

export const multiplyBy150Percent = (numberToMultiply: string) => utils.bigNumberify(numberToMultiply).mul(3).div(2).toString();
