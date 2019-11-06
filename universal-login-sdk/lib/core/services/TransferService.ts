import {ensure, ensureNotNull, isProperAddress, TransferDetails, isValidEnsName} from '@universal-login/commons';
import {InvalidAddressOrEnsName, WalletNotFound} from '../utils/errors';
import {DeployedWallet} from '../../api/DeployedWallet';
import {encodeTransferToMessage} from '../utils/encodeTransferToMessage';

export class TransferService {
  constructor(private deployedWallet: DeployedWallet) {}

  async transfer(transferDetails: TransferDetails) {
    ensure(isProperAddress(transferDetails.to) || isValidEnsName(transferDetails.to), InvalidAddressOrEnsName, transferDetails.to);
    ensureNotNull(this.deployedWallet, WalletNotFound);
    let message;
    if (isProperAddress(transferDetails.to)) {
      message = encodeTransferToMessage({...transferDetails, from: this.deployedWallet.contractAddress});
    } else {
      const targetAddress = await this.deployedWallet.sdk.resolveName(transferDetails.to);
      ensure(targetAddress, InvalidAddressOrEnsName, transferDetails.to);
      message = encodeTransferToMessage({...transferDetails, to: targetAddress, from: this.deployedWallet.contractAddress});
    }
    return this.deployedWallet.execute(message);
  }
}
