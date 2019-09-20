import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {ETHER_NATIVE_TOKEN, ensure, ensureNotNull, isProperAddress, TransferDetails, ApplicationWallet} from '@universal-login/commons';
import UniversalLoginSDK from '../../api/sdk';
import {ApplicationWalletNotFound, InvalidAddress} from '../../core/utils/errors';

export class TransferService {
  constructor(private sdk: UniversalLoginSDK, private applicationWallet: ApplicationWallet) {}

  async transfer(transferDetails: TransferDetails) {
    ensure(isProperAddress(transferDetails.to), InvalidAddress, transferDetails.to);
    ensureNotNull(this.applicationWallet, ApplicationWalletNotFound);
    if (transferDetails.currency === ETHER_NATIVE_TOKEN.symbol) {
      return this.transferEther(transferDetails);
    } else {
      return this.transferTokens(transferDetails);
    }
  }

  private async transferTokens({to, amount, currency} : TransferDetails) {
      const tokenAddress = this.sdk.tokensDetailsStore.getTokenAddress(currency);
      const message = {
        from: this.applicationWallet!.contractAddress,
        to: tokenAddress,
        value: 0,
        data: encodeTransfer(to, amount),
        gasToken: tokenAddress
      };
      return this.sdk.execute(message, this.applicationWallet!.privateKey);
  }

  private async transferEther({to, amount} : TransferDetails) {
      const message = {
        from: this.applicationWallet!.contractAddress,
        to,
        value: utils.parseEther(amount),
        data: '0x',
        gasToken: ETHER_NATIVE_TOKEN.address
      };
      return this.sdk.execute(message, this.applicationWallet!.privateKey);
  }
}

export function encodeTransfer(to: string, amount: string) {
  return new utils.Interface(IERC20.abi).functions.transfer.encode([to, utils.parseEther(amount)]);
}
