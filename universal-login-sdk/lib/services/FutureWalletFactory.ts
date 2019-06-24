import {providers} from 'ethers';
import {Omit} from '@universal-login/commons';
import {createFutureWallet} from '../utils/counterfactual';
import {BalanceObserver} from '../observers/BalanceObserver';
import {DeploymentObserver} from '../observers/DeploymentObserver';
import {BlockchainService} from './BlockchainService';
import {RelayerApi} from '../RelayerApi';
import {PublicRelayerConfig} from '@universal-login/commons/lib';

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
    private config: Omit<PublicRelayerConfig, 'chainSpec'>,
    private provider: providers.Provider,
    private blockchainService: BlockchainService,
    private relayerApi: RelayerApi) {
  }

  async createFutureWallet(): Promise<FutureWallet> {
    const [privateKey, contractAddress, address] = await createFutureWallet(this.config.factoryAddress, this.provider);
    const waitForBalance = async () => new Promise(
      (resolve) => {
        const onReadyToDeploy = (tokenAddress: string, contractAddress: string) => resolve({tokenAddress, contractAddress});
        const balanceObserver = new BalanceObserver(this.config.supportedTokens, this.provider);
        balanceObserver.startAndSubscribe(contractAddress, onReadyToDeploy);
      }
    ) as Promise<BalanceDetails>;

    const deploy = async (ensName: string) => {
      await this.relayerApi.deploy(address, ensName);
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
