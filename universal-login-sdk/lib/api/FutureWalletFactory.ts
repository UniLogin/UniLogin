import {providers} from 'ethers';
import {PublicRelayerConfig, calculateInitializeSignature, MineableStatus} from '@universal-login/commons';
import {DeploymentReadyObserver} from '../core/observers/DeploymentReadyObserver';
import {BlockchainService} from '../integration/ethereum/BlockchainService';
import {RelayerApi} from '../integration/http/RelayerApi';
import {ENSService} from '../integration/ethereum/ENSService';
import {encodeInitializeWithENSData} from '@universal-login/contracts';
import {DeployedWallet} from './DeployedWallet';
import UniversalLoginSDK from './sdk';
import {MineableFactory} from '../core/services/MineableFactory';

export type BalanceDetails = {
  tokenAddress: string;
  contractAddress: string;
};

export interface Deployment {
  waitForTransactionHash: () => Promise<MineableStatus>;
  waitToBeSuccess: () => Promise<DeployedWallet>;
}

export type FutureWallet = {
  privateKey: string;
  contractAddress: string;
  waitForBalance: () => Promise<BalanceDetails>;
  deploy: (ensName: string, gasPrice: string, gasToken: string) => Promise<Deployment>;
};

type FutureFactoryConfig = Pick<PublicRelayerConfig, 'supportedTokens' | 'factoryAddress' | 'contractWhiteList' | 'chainSpec'>;

export class FutureWalletFactory extends MineableFactory {
  private ensService: ENSService;

  constructor(
    private config: FutureFactoryConfig,
    private provider: providers.Provider,
    private blockchainService: BlockchainService,
    private relayerApi: RelayerApi,
    private sdk: UniversalLoginSDK,
    tick?: number,
    timeout?: number,
  ) {
    super(
      tick,
      timeout,
      (hash: string) => this.relayerApi.getDeploymentStatus(hash),
    );
    this.ensService = new ENSService(provider, config.chainSpec.ensAddress);
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
      },
    ) as Promise<BalanceDetails>;

    const deploy = async (ensName: string, gasPrice: string, gasToken: string) => {
      const initData = await this.setupInitData(publicKey, ensName, gasPrice, gasToken);
      const signature = await calculateInitializeSignature(initData, privateKey);
      const {deploymentHash} = await this.relayerApi.deploy(publicKey, ensName, gasPrice, gasToken, signature, this.sdk.sdkConfig.applicationInfo);

      const deployedWallet = new DeployedWallet(
        contractAddress,
        ensName,
        privateKey,
        this.sdk,
      );

      const deployment: Deployment = {
        waitForTransactionHash: this.createWaitForTransactionHash(deploymentHash),
        waitToBeSuccess: async () => {
          await this.createWaitToBeSuccess(deploymentHash)();
          return deployedWallet;
        },
      };
      return deployment;
    };

    return {
      privateKey,
      contractAddress,
      waitForBalance,
      deploy,
    };
  }
}
