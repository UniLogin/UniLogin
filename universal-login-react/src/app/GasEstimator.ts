import {GasParameters, createFullHexString} from '@unilogin/commons';
import {DeployedWallet} from '@unilogin/sdk';

export class GasEstimator {
  static backupCodes(deployedWallet: DeployedWallet, gasParameters?: GasParameters) {
    return gasParameters && deployedWallet.estimateGasFor('addKey', [createFullHexString(20)], gasParameters);
  }

  static addKey(deployedWallet: DeployedWallet, gasParameters?: GasParameters, publicKey?: string) {
    return gasParameters && deployedWallet.estimateGasFor('addKey', [publicKey], gasParameters);
  }

  static removeKey(deployedWallet: DeployedWallet, gasParameters?: GasParameters, keyToRemove?: string) {
    return gasParameters && deployedWallet.estimateGasFor('removeKey', [keyToRemove], gasParameters);
  }
}
