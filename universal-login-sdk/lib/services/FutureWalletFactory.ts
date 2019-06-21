import {providers} from 'ethers';
import {BalanceObserver} from '../observers/BalanceObserver';
import {createFutureWallet} from '../utils/counterfactual';
import {SupportedToken} from '@universal-login/commons';

type BalanceDetails = {
  tokenAddress: string,
  contractAddress: string
};

type FutureWallet = {
  privateKey: string,
  contractAddress: string,
  waitForBalance: () => Promise<BalanceDetails>,
};

export class FutureWalletFactory {

  constructor(private factoryAddress: string, private provider: providers.Provider, private supportedTokens: SupportedToken[]) {
  }

  async getFutureWallet(): Promise<FutureWallet> {
    const [privateKey, contractAddress] = await createFutureWallet(this.factoryAddress, this.provider);
    const waitForBalance = async () => new Promise(
      (resolve) => {
        const onReadyToDeploy = (tokenAddress: string, contractAddress: string) => resolve({tokenAddress, contractAddress});
        const balanceObserver = new BalanceObserver(this.supportedTokens, this.provider);
        balanceObserver.startAndSubscribe(contractAddress, onReadyToDeploy);
      }
    ) as Promise<BalanceDetails>;
    return {
      privateKey,
      contractAddress,
      waitForBalance,
    };
  }
}
