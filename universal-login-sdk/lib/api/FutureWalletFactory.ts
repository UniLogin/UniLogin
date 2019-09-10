import {providers} from 'ethers';
import {PublicRelayerConfig, calculateInitializeSignature, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {DeploymentReadyObserver} from '../core/observers/DeploymentReadyObserver';
import {DeploymentObserver} from '../core/observers/DeploymentObserver';
import {BlockchainService} from '../integration/ethereum/BlockchainService';
import {RelayerApi} from '../integration/http/RelayerApi';
import {ENSService} from '../integration/ethereum/ENSService';
import {encodeInitializeWithENSData} from '@universal-login/contracts';
import {DeployedWallet} from './DeployedWallet';
import UniversalLoginSDK from './sdk';

export type BalanceDetails = {
  tokenAddress: string,
  contractAddress: string
};

export type FutureWallet = {
  privateKey: string,
  contractAddress: string,
  waitForBalance: () => Promise<BalanceDetails>,
  deploy: (ensName: string, gasPrice: string) => Promise<DeployedWallet>
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

  async setupInitData(publicKey: string, ensName: string, gasPrice: string) {
    const args = await this.ensService.argsFor(ensName) as string[];
    const initArgs = [publicKey, ...args, gasPrice, ETHER_NATIVE_TOKEN.address];
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

    const deploy = async (ensName: string, gasPrice: string) => {
      const initData = await this.setupInitData(publicKey, ensName, gasPrice);
      const signature = await calculateInitializeSignature(initData, privateKey);
      await this.relayerApi.deploy(publicKey, ensName, gasPrice, signature);

      const deploymentObserver = new DeploymentObserver(this.blockchainService, this.config.contractWhiteList);
      const address = await new Promise<string>((resolve) => deploymentObserver.startAndSubscribe(contractAddress, resolve));
      return new DeployedWallet(
        address,
        ensName,
        privateKey,
        this.sdk,
      );
    };

    return {
      privateKey,
      contractAddress,
      waitForBalance,
      deploy
    };
  }
}
