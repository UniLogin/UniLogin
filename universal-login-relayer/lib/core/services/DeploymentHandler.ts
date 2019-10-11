import Deployment from '../models/Deployment';
import {calculateDeployHash, DeviceInfo, DeployArgs, DeploymentStatus} from '@universal-login/commons';
import IRepository from './messages/IRepository';
import {IExecutionQueue} from './messages/IExecutionQueue';

class DeploymentHandler {
  constructor(
    _: any,
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
    return this.executionQueue.addDeployment(deployment);
  }

  async getStatus(deploymentHash: string) : Promise<DeploymentStatus | null> {
    let deployment: Deployment;
    try {
      deployment = await this.deploymentRepository.get(deploymentHash);
      const status : DeploymentStatus = {
        deploymentHash,
        error: deployment.error,
        state: deployment.state,
        transactionHash: deployment.transactionHash
      };
      return status;
    } catch (_) {}
    return null;
  }
}

export default DeploymentHandler;
