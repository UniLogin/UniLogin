import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {TransferDetails, ETHER_NATIVE_TOKEN} from '@universal-login/commons';

interface TransferDetailsWithFrom extends TransferDetails {
  from: string;
}

export const transferToMessage = ({from, to, amount, gasParameters, transferToken}: TransferDetailsWithFrom) => {
  const base = {
    from,
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
      data: encodeTransfer(to, amount),
    };
  }
};

export function encodeTransfer(to: string, amount: string) {
  return new utils.Interface(IERC20.abi).functions.transfer.encode([to, utils.parseEther(amount)]);
}
