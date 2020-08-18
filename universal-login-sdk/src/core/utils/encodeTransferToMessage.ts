import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {TransferDetails, ETHER_NATIVE_TOKEN} from '@unilogin/commons';

interface TransferDetailsWithFrom extends TransferDetails {
  from: string;
  gasLimit: utils.BigNumber;
}

export const encodeTransferToMessage = ({from, to, amount, gasParameters, token, gasLimit}: TransferDetailsWithFrom) => {
  const base = {
    from,
    gasLimit,
    gasPrice: gasParameters.gasPrice,
    gasToken: gasParameters.gasToken,
  };
  if (token.address === ETHER_NATIVE_TOKEN.address) {
    return {
      ...base,
      to,
      value: utils.parseEther(amount),
      data: '0x',
    };
  } else {
    return {
      ...base,
      to: token.address,
      value: 0,
      data: encodeERC20Transfer(to, amount, token.decimals),
    };
  }
};

export function encodeERC20Transfer(to: string, amount: string, decimals: number) {
  return new utils.Interface(IERC20.abi).functions.transfer.encode([to, utils.parseUnits(amount, decimals)]);
}
