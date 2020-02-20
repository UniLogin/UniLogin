import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {TransferDetails, ETHER_NATIVE_TOKEN} from '@unilogin/commons';

interface TransferDetailsWithFrom extends TransferDetails {
  from: string;
  gasLimit: utils.BigNumber;
}

export const encodeTransferToMessage = ({from, to, amount, gasParameters, transferToken, gasLimit}: TransferDetailsWithFrom) => {
  const base = {
    from,
    gasLimit,
    gasPrice: gasParameters.gasPrice,
    gasToken: gasParameters.gasToken,
  };
  if (transferToken === ETHER_NATIVE_TOKEN.address) {
    return {
      ...base,
      to,
      value: utils.parseEther(amount),
      data: '0x',
    };
  } else {
    return {
      ...base,
      to: transferToken,
      value: 0,
      data: encodeERC20Transfer(to, amount),
    };
  }
};

export function encodeERC20Transfer(to: string, amount: string) {
  return new utils.Interface(IERC20.abi).functions.transfer.encode([to, utils.parseEther(amount)]);
}
