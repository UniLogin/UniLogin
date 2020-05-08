import {
  SerializableFutureWallet,
  PublicRelayerConfig,
  createKeyPair,
  ensure,
} from '@unilogin/commons';
import {computeGnosisCounterfactualAddress} from '@unilogin/contracts';
import {ENSService} from '../integration/ethereum/ENSService';
import UniLoginSdk from './sdk';
import {FutureWallet} from './wallet/FutureWallet';
import {setupInitData} from '../core/utils/setupInitData';
import {SavingFutureWalletFailed} from '../core/utils/errors';

export type BalanceDetails = {
  contractAddress: string;
};

type FutureFactoryConfig = Pick<PublicRelayerConfig, 'supportedTokens' | 'factoryAddress' | 'ensAddress' | 'walletContractAddress' | 'relayerAddress' | 'fallbackHandlerAddress'>;

export class FutureWalletFactory {
  constructor(
    private config: FutureFactoryConfig,
    private ensService: ENSService,
    private sdk: UniLoginSdk,
  ) {
  }

  createFrom(wallet: SerializableFutureWallet): FutureWallet {
    return new FutureWallet(wallet, this.sdk, this.ensService, this.config.relayerAddress, this.config.fallbackHandlerAddress);
  }

  async createNew(ensName: string, gasPrice: string, gasToken: string): Promise<FutureWallet> {
    const {privateKey, publicKey} = createKeyPair();
    const initializeData = await setupInitData({publicKey, ensName, gasPrice, gasToken, ensService: this.ensService, relayerAddress: this.config.relayerAddress, fallbackHandler: this.config.fallbackHandlerAddress});
    const contractAddress = computeGnosisCounterfactualAddress(this.config.factoryAddress, 1, initializeData, this.config.walletContractAddress);
    const storedFutureWallet = {
      contractAddress,
      publicKey,
      ensName,
      gasPrice,
      gasToken,
    };
    const result = await this.sdk.relayerApi.addFutureWallet(storedFutureWallet);
    ensure(result.contractAddress === contractAddress, SavingFutureWalletFailed);
    return this.createFrom({privateKey, contractAddress, ensName, gasPrice, gasToken});
  }
}
