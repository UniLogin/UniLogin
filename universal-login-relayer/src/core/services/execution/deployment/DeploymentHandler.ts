import Deployment from '../../../models/Deployment';
import {calculateDeployHash, DeviceInfo, DeployArgs, DeploymentStatus} from '@unilogin/commons';
import IRepository from '../../../models/messages/IRepository';
import {IExecutionQueue} from '../../../models/execution/IExecutionQueue';
import {RefundPayerValidator} from '../../validators/RefundPayerValidator';
import {utils} from 'ethers';
import {RefundPayerStore} from '../../../../integration/sql/services/RefundPayerStore';

class DeploymentHandler {
  constructor(
    private deploymentRepository: IRepository<Deployment>,
    private executionQueue: IExecutionQueue,
    private refundPayerValidator: RefundPayerValidator,
    private refundPayerStore: RefundPayerStore,
  ) {}

  async handle(contractAddress: string, deployArgs: DeployArgs, deviceInfo: DeviceInfo, apiKey?: string) {
    if (utils.bigNumberify(deployArgs.gasPrice).isZero()) {
      await this.refundPayerValidator.validate(apiKey);
    }
    const deployment: Deployment = {
      ...deployArgs,
      hash: calculateDeployHash(deployArgs),
      deviceInfo,
      state: 'Queued',
      contractAddress,
      refundPayerId: apiKey && (await this.refundPayerStore.get(apiKey))?.id,
    } as Deployment;
    await this.deploymentRepository.add(deployment.hash, deployment);
    return this.executionQueue.addDeployment(deployment.hash);
  }

  async getStatus(deploymentHash: string): Promise<DeploymentStatus | null> {
    let deployment: Deployment;
    try {
      deployment = await this.deploymentRepository.get(deploymentHash);
      const status: DeploymentStatus = {
        deploymentHash,
        error: deployment.error,
        state: deployment.state,
        transactionHash: deployment.transactionHash,
      };
      return status;
    } catch (e) {
      if (e.errorType !== 'NotFound') {
        throw e;
      }
    }
    return null;
  }
}

export default DeploymentHandler;
