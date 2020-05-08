import {utils} from 'ethers';
import {ensure, BalanceChecker} from '@unilogin/commons';
import {ConcurrentDeployment} from '../utils/errors';
import ObserverRunner from './ObserverRunner';

export type ReadyToDeployCallback = (contractAddress: string) => void;

export class DeploymentReadyObserver extends ObserverRunner {
  private contractAddress?: string;
  private callback?: ReadyToDeployCallback;

  constructor(private tokenAddress: string, private minimalAmount: string, private balanceChecker: BalanceChecker) {
    super();
  }

  startAndSubscribe(contractAddress: string, callback: ReadyToDeployCallback) {
    ensure(this.isStopped(), ConcurrentDeployment);
    this.contractAddress = contractAddress;
    this.callback = callback;
    this.start();
    return () => {
      this.contractAddress = undefined;
      this.stop();
    };
  }

  execute() {
    return this.checkDeploymentReadiness();
  }

  async checkDeploymentReadiness() {
    if (this.contractAddress) {
      const balance = await this.balanceChecker.getBalance(this.contractAddress, this.tokenAddress);
      if (balance.gte(utils.parseEther(this.minimalAmount!))) {
        this.onDeploymentReady(this.contractAddress);
      }
    }
  }

  onDeploymentReady(contractAddress: string) {
    this.callback!(contractAddress);
    this.contractAddress = undefined;
    this.stop();
  }
}
