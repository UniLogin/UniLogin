import {providers} from 'ethers';
import {SupportedToken, ensure, RequiredBalanceChecker, BalanceChecker} from '@universal-login/commons';
import {ConcurrentDeployment} from '../utils/errors';
import ObserverRunner from './ObserverRunner';

export type ReadyToDeployCallback = (tokenAddress: string, contractAddress: string) => void;

export class DeploymentReadyObserver extends ObserverRunner {
  private contractAddress?: string;
  private callback?: ReadyToDeployCallback;
  private requiredBalanceChecker: RequiredBalanceChecker;

  constructor(private supportedTokens: SupportedToken[], private provider: providers.Provider) {
    super();
    this.requiredBalanceChecker = new RequiredBalanceChecker(new BalanceChecker(this.provider));
  }

  async startAndSubscribe(contractAddress: string, callback: ReadyToDeployCallback) {
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
      const tokenAddress = await this.requiredBalanceChecker.findTokenWithRequiredBalance(this.supportedTokens, this.contractAddress);
      if (tokenAddress) {
        this.onDeploymentReady(this.contractAddress, tokenAddress);
      }
    }
  }

  onDeploymentReady(contractAddress: string, tokenAddress: string) {
    this.callback!(tokenAddress, contractAddress);
    this.contractAddress = undefined;
    this.stop();
  }
}
