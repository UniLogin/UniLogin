import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {TransferDetails, ETHER_NATIVE_TOKEN} from '@universal-login/commons';

interface TransferDetailsWithFrom extends TransferDetails {
  from: string;
}

export const transferToMessage = ({from, to, amount, gasParameters, transferToken}: TransferDetailsWithFrom) => {
  if(transferToken === ETHER_NATIVE_TOKEN.address) {
    return {
      from,
      to,
      value: utils.parseEther(amount),
      data: '0x',
      gasToken: gasParameters.gasToken,
      gasPrice: gasParameters.gasPrice
    }
  } else {
    return {
      from,
      to: transferToken,
      value: 0,
      data: encodeTransfer(to, amount),
      gasToken: gasParameters.gasToken,
      gasPrice: gasParameters.gasPrice
    }
  }
}

export function encodeTransfer(to: string, amount: string) {
  return new utils.Interface(IERC20.abi).functions.transfer.encode([to, utils.parseEther(amount)]);
}
