import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import UniversalLoginSDK from '../../api/sdk';
import {WalletService} from '../../core/services/WalletService';
import {ETHER_NATIVE_TOKEN, ensureNotNull, TransferDetails} from '@universal-login/commons';
import {ApplicationWalletNotFound} from '../../core/utils/errors';
import {TokensDetailsStore} from './TokensDetailsStore';

export class TransferService {
  constructor(private sdk: UniversalLoginSDK, private walletService: WalletService, private tokensDetailsStore: TokensDetailsStore) {}

  async transfer(transferDetails: TransferDetails) {
    ensureNotNull(this.walletService.applicationWallet, ApplicationWalletNotFound);
    if (transferDetails.currency === ETHER_NATIVE_TOKEN.symbol) {
      return this.transferEther(transferDetails);
    } else {
      return this.transferTokens(transferDetails);
    }
  }

  private async transferTokens({to, amount, currency} : TransferDetails) {
      const tokenAddress = this.tokensDetailsStore.getTokenAddress(currency);
      const message = {
        from: this.walletService.applicationWallet!.contractAddress,
        to: tokenAddress,
        value: 0,
        data: encodeTransfer(to, amount),
        gasToken: tokenAddress
      };
      const {waitToBeMined} = await this.sdk.execute(message, this.walletService.applicationWallet!.privateKey);
      return waitToBeMined();
  }

  private async transferEther({to, amount} : TransferDetails) {
      const message = {
        from: this.walletService.applicationWallet!.contractAddress,
        to,
        value: utils.parseEther(amount),
        data: '0x0',
        gasToken: ETHER_NATIVE_TOKEN.address
      };
      const {waitToBeMined} = await this.sdk.execute(message, this.walletService.applicationWallet!.privateKey);
      return waitToBeMined();
  }
}

export function encodeTransfer(to: string, amount: string) {
  return new utils.Interface(IERC20.abi).functions.transfer.encode([to, utils.parseEther(amount)]);
}
