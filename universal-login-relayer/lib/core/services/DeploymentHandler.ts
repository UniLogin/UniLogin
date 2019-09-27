import Deployment from '../models/Deployment';
import WalletService from '../../integration/ethereum/WalletService';
import {DeviceInfo, DeployArgs} from '@universal-login/commons';
import {calculateDeployHash} from '@universal-login/commons/dist/lib/core/utils/messages/calculateMessageSignature';
import IRepository from './messages/IRepository';
import {IExecutionQueue} from './messages/IExecutionQueue';

class DeploymentHandler {
  constructor(
    private walletService: WalletService,
    private deploymentRepository: IRepository<Deployment>,
    private executionQueue: IExecutionQueue
  ) {}

  async handleDeployment(deployArgs: DeployArgs, deviceInfo: DeviceInfo) {
    const deployment : Deployment = {
      ...deployArgs,
      hash: calculateDeployHash(deployArgs)
    };
    await this.deploymentRepository.add(deployment.hash, deployment);
    await this.executionQueue.addDeployment(deployment);
    return this.walletService.deploy(deployment, deviceInfo);
  }
}

export default DeploymentHandler;
