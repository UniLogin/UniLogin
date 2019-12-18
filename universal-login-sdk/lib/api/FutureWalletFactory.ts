import {providers} from 'ethers';
import {
  SerializableFutureWallet,
  PublicRelayerConfig,
} from '@universal-login/commons';
import {BlockchainService} from '@universal-login/contracts';
import {RelayerApi} from '../integration/http/RelayerApi';
import {ENSService} from '../integration/ethereum/ENSService';
import UniversalLoginSDK from './sdk';
import {DeploymentReadyObserver} from '../core/observers/DeploymentReadyObserver';
import {FutureWallet} from './wallet/FutureWallet';

export type BalanceDetails = {
  tokenAddress: string;
  contractAddress: string;
};

type FutureFactoryConfig = Pick<PublicRelayerConfig, 'supportedTokens' | 'factoryAddress' | 'contractWhiteList' | 'chainSpec'>;

export class FutureWalletFactory {
  private ensService: ENSService;
  private deploymentReadyObserver: DeploymentReadyObserver;

  constructor(
    private config: FutureFactoryConfig,
    provider: providers.Provider,
    private blockchainService: BlockchainService,
    private sdk: UniversalLoginSDK,
  ) {
    this.ensService = new ENSService(provider, config.chainSpec.ensAddress);
    this.deploymentReadyObserver = new DeploymentReadyObserver(config.supportedTokens, provider);
  }

  createFromExistingCounterfactual(wallet: SerializableFutureWallet): FutureWallet {
    return new FutureWallet(wallet, this.config.supportedTokens, this.sdk, this.ensService);
  }

  async createFutureWallet(): Promise<FutureWallet> {
    const [privateKey, contractAddress] = await this.blockchainService.createFutureWallet(this.config.factoryAddress);
    return this.createFromExistingCounterfactual({privateKey, contractAddress});
  }
}
