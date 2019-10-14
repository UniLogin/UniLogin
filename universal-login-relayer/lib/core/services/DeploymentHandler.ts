import Deployment from '../models/Deployment';
import WalletService from '../../integration/ethereum/WalletService';
import {calculateDeployHash, DeviceInfo, DeployArgs} from '@universal-login/commons';
import IRepository from '../models/messages/IRepository';
import {IExecutionQueue} from '../models/execution/IExecutionQueue';

class DeploymentHandler {
  constructor(
    private walletService: WalletService,
    private deploymentRepository: IRepository<Deployment>,
    private executionQueue: IExecutionQueue
  ) {}

  async handleDeployment(deployArgs: DeployArgs, deviceInfo: DeviceInfo) {
    const deployment : Deployment = {
      ...deployArgs,
      hash: calculateDeployHash(deployArgs),
      deviceInfo,
      state: 'Queued'
    } as Deployment;
    await this.deploymentRepository.add(deployment.hash, deployment);
    await this.executionQueue.addDeployment(deployment);
    return this.walletService.deploy(deployment, deviceInfo);
  }
}

export default DeploymentHandler;
