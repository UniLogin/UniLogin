import {utils} from 'ethers';

export const isBiggerThan = (value: utils.BigNumber, validationValue: utils.BigNumber) => value.gt(validationValue) ? value : validationValue;
