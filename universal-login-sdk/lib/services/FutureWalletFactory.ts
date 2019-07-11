import {providers} from 'ethers';
import {Omit, calculateDeploySignature, PublicRelayerConfig} from '@universal-login/commons';
import {createFutureWallet} from '../utils/counterfactual';
import {BalanceObserver} from '../observers/BalanceObserver';
import {DeploymentObserver} from '../observers/DeploymentObserver';
import {BlockchainService} from './BlockchainService';
import {RelayerApi} from '../RelayerApi';

export type BalanceDetails = {
  tokenAddress: string,
  contractAddress: string
};

export type FutureWallet = {
  privateKey: string,
  contractAddress: string,
  waitForBalance: () => Promise<BalanceDetails>,
  deploy: (ensName: string, gasPrice: string) => Promise<string>
};

export class FutureWalletFactory {

  constructor(
    private config: Omit<PublicRelayerConfig, 'chainSpec'>,
    private provider: providers.Provider,
    private blockchainService: BlockchainService,
    private relayerApi: RelayerApi) {
  }

  async createFutureWallet(): Promise<FutureWallet> {
    const [privateKey, contractAddress, publicKey] = await createFutureWallet(this.config.factoryAddress, this.provider);
    const waitForBalance = async () => new Promise(
      (resolve) => {
        const onReadyToDeploy = (tokenAddress: string, contractAddress: string) => resolve({tokenAddress, contractAddress});
        const balanceObserver = new BalanceObserver(this.config.supportedTokens, this.provider);
        balanceObserver.startAndSubscribe(contractAddress, onReadyToDeploy);
      }
    ) as Promise<BalanceDetails>;

    const deploy = async (ensName: string, gasPrice: string) => {
      const signature = await calculateDeploySignature(ensName, gasPrice, privateKey);
      await this.relayerApi.deploy(publicKey, ensName, gasPrice, signature);
      return new Promise(
        (resolve) => {
          const deploymentObserver = new DeploymentObserver(this.blockchainService, this.config.contractWhiteList);
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
