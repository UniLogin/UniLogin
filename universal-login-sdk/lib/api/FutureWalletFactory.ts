import {providers, utils} from 'ethers';
import {
  calculateInitializeSignature,
  SerializableFutureWallet,
  MineableStatus,
  PublicRelayerConfig,
  ensure,
  isValidEnsName, PaymentOptions,
} from '@universal-login/commons';
import {DeploymentReadyObserver} from '../core/observers/DeploymentReadyObserver';
import {BlockchainService} from '../integration/ethereum/BlockchainService';
import {RelayerApi} from '../integration/http/RelayerApi';
import {ENSService} from '../integration/ethereum/ENSService';
import {encodeInitializeWithENSData} from '@universal-login/contracts';
import {DeployedWallet} from './DeployedWallet';
import UniversalLoginSDK from './sdk';
import {MineableFactory} from '../core/services/MineableFactory';
import {InvalidAddressOrEnsName} from '../core/utils/errors';

export type BalanceDetails = {
  tokenAddress: string;
  contractAddress: string;
};

export interface Deployment {
  waitForTransactionHash: () => Promise<MineableStatus>;
  waitToBeSuccess: () => Promise<DeployedWallet>;
}

export interface FutureWallet extends SerializableFutureWallet {
  waitForBalance: () => Promise<BalanceDetails>;
  deploy: (ensName: string, gasPrice: string, gasToken: string) => Promise<Deployment>;
}

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

  private async setupInitData(publicKey: string, ensName: string, gasPrice: string, gasToken: string) {
    const args = await this.ensService.argsFor(ensName) as string[];
    const initArgs = [publicKey, ...args, gasPrice, gasToken];
    return encodeInitializeWithENSData(initArgs);
  }

  async createFromExistingCounterfactual(wallet: SerializableFutureWallet): Promise<FutureWallet> {
    const {ensName, privateKey, contractAddress} = wallet;
    const publicKey = utils.computeAddress(privateKey);

    return {
      ensName,
      privateKey,
      contractAddress,
      waitForBalance: async () => new Promise<BalanceDetails>(
        (resolve) => {
          const deploymentReadyObserver = new DeploymentReadyObserver(this.config.supportedTokens, this.provider);
          deploymentReadyObserver.startAndSubscribe(
            contractAddress,
            (tokenAddress, contractAddress) => resolve({tokenAddress, contractAddress}),
          ).catch(console.error);
        },
      ),
      deploy: async (ensName: string, gasPrice: string, gasToken: string): Promise<Deployment> => {
        ensure(isValidEnsName(ensName), InvalidAddressOrEnsName, ensName);
        const initData = await this.setupInitData(publicKey, ensName, gasPrice, gasToken);
        const signature = await calculateInitializeSignature(initData, privateKey);
        const {deploymentHash} = await this.relayerApi.deploy(publicKey, ensName, gasPrice, gasToken, signature, this.sdk.sdkConfig.applicationInfo);

        return {
          waitForTransactionHash: this.createWaitForTransactionHash(deploymentHash),
          waitToBeSuccess: async () => {
            await this.createWaitToBeSuccess(deploymentHash)();
            return new DeployedWallet(contractAddress, ensName, privateKey, this.sdk);
          },
        };
      },
    };
  }

  async createFutureWallet(ensName: string): Promise<FutureWallet> {
    const [privateKey, contractAddress] = await this.blockchainService.createFutureWallet(this.config.factoryAddress);
    return this.createFromExistingCounterfactual({ensName, privateKey, contractAddress});
  }
}
