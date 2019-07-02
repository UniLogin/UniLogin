import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import UniversalLoginSDK from '@universal-login/sdk';
import {ETHER_NATIVE_TOKEN, ensureNotNull} from '@universal-login/commons';
import {UserWalletNotFound} from '../../services/utils/errors';
import TransferDetails from '../../core/entities/TransferDetails';
import WalletService from '../storage/WalletService';
import TokenService from './TokenService';

class TransferService {
  constructor(private sdk: UniversalLoginSDK, private walletService: WalletService, private tokenService: TokenService) {}

  async transfer(transferDetails: TransferDetails) {
    ensureNotNull(this.walletService.userWallet, UserWalletNotFound);
    if (transferDetails.currency === ETHER_NATIVE_TOKEN.symbol) {
      return this.transferEther(transferDetails);
    } else {
      return this.transferTokens(transferDetails);
    }
  }

  private async transferTokens({to, amount, currency} : TransferDetails) {
      const tokenAddress = this.tokenService.getTokenAddress(currency);
      const message = {
        from: this.walletService.userWallet!.contractAddress,
        to: tokenAddress,
        value: 0,
        data: encodeTransfer(to, amount),
        gasToken: tokenAddress
      };
      return this.sdk.execute(message, this.walletService.userWallet!.privateKey);
  }

  private async transferEther({to, amount} : TransferDetails) {
      const message = {
        from: this.walletService.userWallet!.contractAddress,
        to,
        value: utils.parseEther(amount),
        data: '0x0',
        gasToken: ETHER_NATIVE_TOKEN.address
      };
      return this.sdk.execute(message, this.walletService.userWallet!.privateKey);
  }
}

export function encodeTransfer(to: string, amount: string) {
  return new utils.Interface(IERC20.abi).functions.transfer.encode([to, utils.parseEther(amount)]);
}

export default TransferService;
