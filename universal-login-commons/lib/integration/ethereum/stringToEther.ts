import {utils} from 'ethers';


export const stringToEther = (value: string) => utils.parseEther(value).toString();
