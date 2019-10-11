import {providers} from 'ethers';
import {PublicRelayerConfig, calculateInitializeSignature, DeploymentStatus, ensure} from '@universal-login/commons';
import {DeploymentReadyObserver} from '../core/observers/DeploymentReadyObserver';
import {BlockchainService} from '../integration/ethereum/BlockchainService';
import {RelayerApi} from '../integration/http/RelayerApi';
import {ENSService} from '../integration/ethereum/ENSService';
import {encodeInitializeWithENSData} from '@universal-login/contracts';
import {DeployedWallet} from './DeployedWallet';
import UniversalLoginSDK from './sdk';
import {retry} from '../core/utils/retry';

const DEFAULT_EXECUTION_TIMEOUT = 600000;
const DEFAULT_EXECUTION_TICK = 1000;

export type BalanceDetails = {
  tokenAddress: string,
  contractAddress: string
};

export interface Deployment {
  waitForTransactionHash: () => Promise<string>;
  waitToBeSuccess: () => Promise<void>;
  deployedWallet: DeployedWallet;
}

export type FutureWallet = {
  privateKey: string,
  contractAddress: string,
  waitForBalance: () => Promise<BalanceDetails>,
  deploy: (ensName: string, gasPrice: string, gasToken: string) => Promise<Deployment>
};

type FutureFactoryConfig = Pick<PublicRelayerConfig, 'supportedTokens' | 'factoryAddress' | 'contractWhiteList' | 'chainSpec'>;

export class FutureWalletFactory {
  private ensService: ENSService;

  constructor(
    private config: FutureFactoryConfig,
    private provider: providers.Provider,
    private blockchainService: BlockchainService,
    private relayerApi: RelayerApi,
    private sdk: UniversalLoginSDK,
  ) {
      this.ensService = new ENSService(provider, config.chainSpec.ensAddress);
  }

  private isExecuted(deploymentStatus: DeploymentStatus) {
    return deploymentStatus.state === 'Error' || deploymentStatus.state === 'Success';
  }

  private hasTransactionHash(deploymentStatus: DeploymentStatus) {
    return ['Pending', 'Success', 'Error'].includes(deploymentStatus.state) && deploymentStatus.transactionHash !== null;
  }

  private createWaitToBeSuccess(deploymentHash: string) {
    return async () => {
      const getStatus = async () => this.relayerApi.getDeploymentStatus(deploymentHash);
      const isNotExecuted = (deploymentStatus: DeploymentStatus) => !this.isExecuted(deploymentStatus);
      const status = await retry(getStatus, isNotExecuted, DEFAULT_EXECUTION_TIMEOUT, DEFAULT_EXECUTION_TICK);
      ensure(!status.error, Error, status.error!);
    };
  }

  private createWaitForTransactionHash(deploymentHash: string) {
    return async () => {
      const getStatus = async () => this.relayerApi.getDeploymentStatus(deploymentHash);
      const isNotPending = (deploymentStatus: DeploymentStatus) => !this.hasTransactionHash(deploymentStatus);
      const status = await retry(getStatus, isNotPending, DEFAULT_EXECUTION_TIMEOUT, DEFAULT_EXECUTION_TICK);
      return status.transactionHash!;
    };
  }

  async setupInitData(publicKey: string, ensName: string, gasPrice: string, gasToken: string) {
    const args = await this.ensService.argsFor(ensName) as string[];
    const initArgs = [publicKey, ...args, gasPrice, gasToken];
    return encodeInitializeWithENSData(initArgs);
  }

  async createFutureWallet(): Promise<FutureWallet> {
    const [privateKey, contractAddress, publicKey] = await this.blockchainService.createFutureWallet(this.config.factoryAddress);
    const waitForBalance = async () => new Promise(
      (resolve) => {
        const onReadyToDeploy = (tokenAddress: string, contractAddress: string) => resolve({tokenAddress, contractAddress});
        const deploymentReadyObserver = new DeploymentReadyObserver(this.config.supportedTokens, this.provider);
        deploymentReadyObserver.startAndSubscribe(contractAddress, onReadyToDeploy)
          .catch(console.error);
      }
    ) as Promise<BalanceDetails>;

    const deploy = async (ensName: string, gasPrice: string, gasToken: string) => {
      const initData = await this.setupInitData(publicKey, ensName, gasPrice, gasToken);
      const signature = await calculateInitializeSignature(initData, privateKey);
      const deploymentHash = await this.relayerApi.deploy(publicKey, ensName, gasPrice, gasToken, signature, this.sdk.sdkConfig.applicationInfo);

      const deployment: Deployment = {
        waitForTransactionHash: this.createWaitForTransactionHash(deploymentHash),
        waitToBeSuccess: this.createWaitToBeSuccess(deploymentHash),
        deployedWallet: new DeployedWallet(
          contractAddress,
          ensName,
          privateKey,
          this.sdk,
        )
      };
      return deployment;
    };

    return {
      privateKey,
      contractAddress,
      waitForBalance,
      deploy
    };
  }
}
