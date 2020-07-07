import {providers, utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';

const IERC20Interface = new utils.Interface(IERC20.abi);

export const isAddressIncludedInLog = (address: string) =>
  (log: providers.Log) => {
    const {values} = IERC20Interface.parseLog(log);
    return values.from === address || values.to === address;
  };
