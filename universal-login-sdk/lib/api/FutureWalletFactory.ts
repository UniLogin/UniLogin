import {
  SerializableFutureWallet,
  PublicRelayerConfig,
} from '@universal-login/commons';
import {BlockchainService} from '@universal-login/contracts';
import {ENSService} from '../integration/ethereum/ENSService';
import UniversalLoginSDK from './sdk';
import {FutureWallet} from './wallet/FutureWallet';

export type BalanceDetails = {
  tokenAddress: string;
  contractAddress: string;
};

type FutureFactoryConfig = Pick<PublicRelayerConfig, 'supportedTokens' | 'factoryAddress' | 'chainSpec'>;

export class FutureWalletFactory {
  constructor(
    private config: FutureFactoryConfig,
    private ensService: ENSService,
    private blockchainService: BlockchainService,
    private sdk: UniversalLoginSDK,
  ) {
  }

  createFrom(wallet: SerializableFutureWallet): FutureWallet {
    return new FutureWallet(wallet, this.config.supportedTokens, this.sdk, this.ensService);
  }

  async createNew(): Promise<FutureWallet> {
    const [privateKey, contractAddress] = await this.blockchainService.createFutureWallet(this.config.factoryAddress);
    return this.createFrom({privateKey, contractAddress});
  }
}
