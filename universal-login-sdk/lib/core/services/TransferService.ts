import {ensure, ensureNotNull, isProperAddress, TransferDetails, isValidEnsName} from '@universal-login/commons';
import {InvalidAddressOrEnsName, WalletNotFound} from '../utils/errors';
import {DeployedWallet} from '../../api/DeployedWallet';
import {encodeTransferToMessage} from '../utils/encodeTransferToMessage';
import {getTargetAddress} from '../utils/getTargetAddress';

export class TransferService {
  constructor(private deployedWallet: DeployedWallet) {}

  async transfer(transferDetails: TransferDetails) {
    ensure(isProperAddress(transferDetails.to) || isValidEnsName(transferDetails.to), InvalidAddressOrEnsName, transferDetails.to);
    ensureNotNull(this.deployedWallet, WalletNotFound);
    const targetAddress = await getTargetAddress(this.deployedWallet.sdk, transferDetails.to);
    const message = encodeTransferToMessage({...transferDetails, to: targetAddress, from: this.deployedWallet.contractAddress});
    return this.deployedWallet.execute(message);
  }
}
