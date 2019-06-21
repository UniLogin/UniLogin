import {providers} from 'ethers';
import {SupportedToken, ContractWhiteList} from '@universal-login/commons';
import {createFutureWallet} from '../utils/counterfactual';
import {BalanceObserver} from '../observers/BalanceObserver';
import {DeploymentObserver} from '../observers/DeploymentObserver';
import {BlockchainService} from './BlockchainService';

type BalanceDetails = {
  tokenAddress: string,
  contractAddress: string
};

type FutureWallet = {
  privateKey: string,
  contractAddress: string,
  waitForBalance: () => Promise<BalanceDetails>,
  deploy: (ensName: string) => Promise<any>
};

export class FutureWalletFactory {

  constructor(
    private factoryAddress: string,
    private provider: providers.Provider,
    private supportedTokens: SupportedToken[],
    private blockchainService: BlockchainService,
    private contractWhiteList: ContractWhiteList,
    private deployCallback: (publicKey: string, ensName: string) => Promise<string>) {
  }

  async createFutureWallet(): Promise<FutureWallet> {
    const [privateKey, contractAddress, address] = await createFutureWallet(this.factoryAddress, this.provider);
    const waitForBalance = async () => new Promise(
      (resolve) => {
        const onReadyToDeploy = (tokenAddress: string, contractAddress: string) => resolve({tokenAddress, contractAddress});
        const balanceObserver = new BalanceObserver(this.supportedTokens, this.provider);
        balanceObserver.startAndSubscribe(contractAddress, onReadyToDeploy);
      }
    ) as Promise<BalanceDetails>;

    const deploy = async (ensName: string) => {
      await this.deployCallback(address, ensName);
      return new Promise(
        (resolve) => {
          const deploymentObserver = new DeploymentObserver(this.blockchainService, this.contractWhiteList);
          const onContractDeployed = (contractAddress: string) => resolve(contractAddress);
          deploymentObserver.startAndSubscribe(contractAddress, onContractDeployed);
        }
      ) as Promise<string>;
    };

    return {
      privateKey,
      contractAddress,
      waitForBalance,
      deploy
    };
  }
}
