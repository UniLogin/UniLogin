import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {ETHER_NATIVE_TOKEN, ensure, ensureNotNull, isProperAddress, TransferDetails} from '@universal-login/commons';
import {DeployedWalletNotFound, InvalidAddress} from '../utils/errors';
import {DeployedWallet} from '../../api/DeployedWallet';

export class TransferService {
  constructor(private deployedWallet : DeployedWallet) {}

  async transfer(transferDetails: TransferDetails) {
    ensure(isProperAddress(transferDetails.to), InvalidAddress, transferDetails.to);
    ensureNotNull(this.deployedWallet, DeployedWalletNotFound);
    if (transferDetails.currency === ETHER_NATIVE_TOKEN.symbol) {
      return this.transferEther(transferDetails);
    } else {
      return this.transferTokens(transferDetails);
    }
  }

  private async transferTokens({to, amount, currency} : TransferDetails) {
    const {sdk, contractAddress, privateKey} = this.deployedWallet;
    const tokenAddress = sdk.tokensDetailsStore.getTokenAddress(currency);
    const message = {
      from: contractAddress,
      to: tokenAddress,
      value: 0,
      data: encodeTransfer(to, amount),
      gasToken: tokenAddress
    };
    return sdk.execute(message, privateKey);
  }

  private async transferEther({to, amount} : TransferDetails) {
    const {sdk, contractAddress, privateKey} = this.deployedWallet;
    const message = {
      from: contractAddress,
      to,
      value: utils.parseEther(amount),
      data: '0x',
      gasToken: ETHER_NATIVE_TOKEN.address
    };
    return sdk.execute(message, privateKey);
  }
}

export function encodeTransfer(to: string, amount: string) {
  return new utils.Interface(IERC20.abi).functions.transfer.encode([to, utils.parseEther(amount)]);
}
