import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {ensure, ensureNotNull, ETHER_NATIVE_TOKEN, isProperAddress, TransferDetails} from '@universal-login/commons';
import {InvalidAddress, WalletNotFound} from '../utils/errors';
import {DeployedWallet} from '../../api/DeployedWallet';

export class TransferService {
  constructor(private deployedWallet: DeployedWallet) {}

  async transfer(transferDetails: TransferDetails) {
    ensure(isProperAddress(transferDetails.to), InvalidAddress, transferDetails.to);
    ensureNotNull(this.deployedWallet, WalletNotFound);
    if (transferDetails.transferToken === ETHER_NATIVE_TOKEN.address) {
      return this.transferEther(transferDetails);
    } else {
      return this.transferTokens(transferDetails);
    }
  }

  private async transferTokens({to, amount, transferToken, gasParameters} : TransferDetails) {
    const {sdk, contractAddress, privateKey} = this.deployedWallet;
    const message = {
      from: contractAddress,
      to: transferToken,
      value: 0,
      data: encodeTransfer(to, amount),
      gasToken: gasParameters.gasToken,
      gasPrice: gasParameters.gasPrice
    };
    return sdk.execute(message, privateKey);
  }

  private async transferEther({to, amount, gasParameters}: TransferDetails) {
    const {sdk, contractAddress, privateKey} = this.deployedWallet;
    const message = {
      from: contractAddress,
      to,
      value: utils.parseEther(amount),
      data: '0x',
      gasToken: gasParameters.gasToken,
      gasPrice: gasParameters.gasPrice
    };
    return sdk.execute(message, privateKey);
  }
}

export function encodeTransfer(to: string, amount: string) {
  return new utils.Interface(IERC20.abi).functions.transfer.encode([to, utils.parseEther(amount)]);
}
