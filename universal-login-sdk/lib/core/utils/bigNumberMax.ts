import {utils} from 'ethers';

export const bigNumberMax = (value: utils.BigNumber, validationValue: utils.BigNumber) => value.gt(validationValue) ? value : validationValue;
