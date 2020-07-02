import {providers} from 'ethers';
import {QueueItem} from '../../core/models/QueueItem';
import {IExecutor} from '../../core/models/execution/IExecutor';
import Deployment from '../../core/models/Deployment';
import IRepository from '../../core/models/messages/IRepository';
import {TransactionHashNotFound, GasUsedNotFound} from '../../core/utils/errors';
import {ensureNotFalsy} from '@unilogin/commons';
import {WalletDeploymentService} from './WalletDeploymentService';

export class DeploymentExecutor implements IExecutor<Deployment> {
  constructor(
    private deploymentRepository: IRepository<Deployment>,
    private walletService: WalletDeploymentService,
  ) {}

  canExecute(item: QueueItem): boolean {
    return item.type === 'Deployment';
  }

  async handleExecute(deploymentHash: string) {
    try {
      const deployment = await this.deploymentRepository.get(deploymentHash);
      const transactionResponse = await this.execute(deployment);
      const {hash, wait, gasPrice} = transactionResponse;
      ensureNotFalsy(hash, TransactionHashNotFound);
      await this.deploymentRepository.markAsPending(deploymentHash, hash!, gasPrice.toString());
      const {gasUsed} = await wait();
      ensureNotFalsy(gasUsed, GasUsedNotFound);
      await this.deploymentRepository.markAsSuccess(deploymentHash, gasUsed.toString());
    } catch (error) {
      const errorMessage = `${error.name}: ${error.message}`;
      await this.deploymentRepository.markAsError(deploymentHash, errorMessage);
    }
  }

  execute(deployment: Deployment): Promise<providers.TransactionResponse> {
    return this.walletService.deploy(deployment, deployment.deviceInfo);
  }
}

export default DeploymentExecutor;
