import Deployment from '../../../models/Deployment';
import {calculateDeployHash, DeviceInfo, DeployArgs, DeploymentStatus, ensure, ensureNotFalsy} from '@unilogin/commons';
import IRepository from '../../../models/messages/IRepository';
import {IExecutionQueue} from '../../../models/execution/IExecutionQueue';
import {FutureWalletStore} from '../../../../integration/sql/services/FutureWalletStore';
import {GasTokenValidator} from '../../validators/GasTokenValidator';
import {InvalidValue, FutureWalletNotFound} from '../../../utils/errors';

class DeploymentHandler {
  constructor(
    private deploymentRepository: IRepository<Deployment>,
    private executionQueue: IExecutionQueue,
    private gasTokenValidator: GasTokenValidator,
    private futureWalletStore: FutureWalletStore,
  ) {}

  async handle(contractAddress: string, deployArgs: DeployArgs, deviceInfo: DeviceInfo, refundPayerId?: string) {
    const storedFutureWallet = await this.futureWalletStore.get(contractAddress);
    ensureNotFalsy(storedFutureWallet, FutureWalletNotFound);
    ensure(storedFutureWallet.gasPrice === deployArgs.gasPrice, InvalidValue, 'gas price', storedFutureWallet.gasPrice, deployArgs.gasPrice);
    ensure(storedFutureWallet.gasToken === deployArgs.gasToken, InvalidValue, 'gas token', storedFutureWallet.gasToken, deployArgs.gasToken);
    await this.gasTokenValidator.validate(storedFutureWallet, 0.3);
    const deployment: Deployment = {
      ...deployArgs,
      hash: calculateDeployHash(deployArgs),
      deviceInfo,
      state: 'Queued',
      contractAddress,
      refundPayerId,
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
