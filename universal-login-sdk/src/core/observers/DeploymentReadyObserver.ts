import {utils} from 'ethers';
import {BalanceChecker, sleep} from '@unilogin/commons';

export type ReadyToDeployCallback = (contractAddress: string) => void;

export class DeploymentReadyObserver {
  constructor(
    private tokenAddress: string,
    private minimalAmount: string,
    private balanceChecker: BalanceChecker,
    private tick = 1000,
  ) {
  }

  async waitForBalance(contractAddress: string): Promise<void> {
    while (true) {
      if (await this.isDeploymentReady(contractAddress)) {
        return;
      }
      await sleep(this.tick);
    }
  }

  private async isDeploymentReady(contractAddress: string) {
    const balance = await this.balanceChecker.getBalance(contractAddress, this.tokenAddress);
    return balance.gte(utils.parseEther(this.minimalAmount!));
  }
}
