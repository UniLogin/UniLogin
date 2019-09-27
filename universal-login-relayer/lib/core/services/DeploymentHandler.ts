import Deployment from '../models/Deployment';
import WalletService from '../../integration/ethereum/WalletService';
import {DeviceInfo, DeployArgs} from '@universal-login/commons';
import {calculateDeployHash} from '@universal-login/commons/dist/lib/core/utils/messages/calculateMessageSignature';

class DeploymentHandler {
  constructor(
    private walletService: WalletService
  ) {}

  async handleDeployment(deployArgs: DeployArgs, deviceInfo: DeviceInfo) {
    const deployment : Deployment = {
      ...deployArgs,
      hash: calculateDeployHash(deployArgs)
    };
    return this.walletService.deploy(deployment, deviceInfo);
  }
}

export default DeploymentHandler;
