import {ensure, ensureNotNull, isProperAddress, TransferDetails} from '@universal-login/commons';
import {InvalidAddress, WalletNotFound} from '../utils/errors';
import {DeployedWallet} from '../../api/DeployedWallet';
import {transferToMessage} from '../utils/transferToMessage';

export class TransferService {
  constructor(private deployedWallet: DeployedWallet) {}

  async transfer(transferDetails: TransferDetails) {
    ensure(isProperAddress(transferDetails.to), InvalidAddress, transferDetails.to);
    ensureNotNull(this.deployedWallet, WalletNotFound);
    const message = transferToMessage({...transferDetails, from: this.deployedWallet.contractAddress});
    return this.deployedWallet.execute(message);
  }
}
