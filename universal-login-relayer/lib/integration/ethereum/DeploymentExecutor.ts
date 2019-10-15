import {providers} from 'ethers';
import {QueueItem} from '../../core/models/QueueItem';
import {IExecutor} from '../../core/models/execution/IExecutor';
import Deployment from '../../core/models/Deployment';
import IRepository from '../../core/models/messages/IRepository';
import {TransactionHashNotFound} from '../../core/utils/errors';
import {ensureNotNull} from '@universal-login/commons';
import WalletService from './WalletService';

export class DeploymentExecutor implements IExecutor<Deployment> {

  constructor(
    private deploymentRepository: IRepository<Deployment>,
    private walletService: WalletService
  ) {}

  canExecute(item: QueueItem): boolean {
    return item.type === 'Deployment';
  }

  async handleExecute(deploymentHash: string) {
    try {
      const deployment = await this.deploymentRepository.get(deploymentHash);
      const transactionResponse = await this.execute(deployment);
      const {hash, wait} = transactionResponse;
      ensureNotNull(hash, TransactionHashNotFound);
      await this.deploymentRepository.markAsPending(deploymentHash, hash!);
      await wait();
      await this.deploymentRepository.setState(deploymentHash, 'Success');
    } catch (error) {
      const errorMessage = `${error.name}: ${error.message}`;
      await this.deploymentRepository.markAsError(deploymentHash, errorMessage);
    }
  }

  async execute(deployment: Deployment): Promise<providers.TransactionResponse> {
    return this.walletService.deploy(deployment, deployment.deviceInfo);
  }
}

export default DeploymentExecutor;
