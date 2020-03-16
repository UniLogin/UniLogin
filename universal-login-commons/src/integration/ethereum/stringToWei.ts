import {utils} from 'ethers';

export const stringToWei = (value: string) => utils.parseEther(value).toString();
