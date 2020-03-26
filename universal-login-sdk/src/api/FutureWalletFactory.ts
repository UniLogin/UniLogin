import {
  SerializableFutureWallet,
  PublicRelayerConfig,
  createKeyPair,
} from '@unilogin/commons';
import {computeGnosisCounterfactualAddress} from '@unilogin/contracts';
import {ENSService} from '../integration/ethereum/ENSService';
import UniversalLoginSDK from './sdk';
import {FutureWallet} from './wallet/FutureWallet';
import {setupInitData} from '../core/utils/setupInitData';

export type BalanceDetails = {
  tokenAddress: string;
  contractAddress: string;
};

type FutureFactoryConfig = Pick<PublicRelayerConfig, 'supportedTokens' | 'factoryAddress' | 'chainSpec' | 'walletContractAddress' | 'relayerAddress' | 'fallbackHandlerAddress'>;

export class FutureWalletFactory {
  constructor(
    private config: FutureFactoryConfig,
    private ensService: ENSService,
    private sdk: UniversalLoginSDK,
  ) {
  }

  createFrom(wallet: SerializableFutureWallet): FutureWallet {
    return new FutureWallet(wallet, this.sdk, this.ensService, this.config.relayerAddress, this.config.fallbackHandlerAddress);
  }

  async createNew(ensName: string, gasPrice: string, gasToken: string): Promise<FutureWallet> {
    const {privateKey, publicKey} = createKeyPair();
    const initializeData = await setupInitData({publicKey, ensName, gasPrice, gasToken, ensService: this.ensService, relayerAddress: this.config.relayerAddress, fallbackHandler: this.config.fallbackHandlerAddress});
    const contractAddress = computeGnosisCounterfactualAddress(this.config.factoryAddress, 1, initializeData, this.config.walletContractAddress);
    return this.createFrom({privateKey, contractAddress, ensName, gasPrice, gasToken});
  }
}
