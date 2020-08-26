import {
  SerializableFutureWallet,
  PublicRelayerConfig,
  createKeyPair,
  ensure,
  BalanceChecker,
  StoredEncryptedWallet,
  SerializableConfirmedWallet,
} from '@unilogin/commons';
import {computeGnosisCounterfactualAddress} from '@unilogin/contracts';
import {ENSService} from '../integration/ethereum/ENSService';
import UniLoginSdk from './sdk';
import {Wallet} from 'ethers';
import {FutureWallet} from './wallet/FutureWallet';
import {setupInitData} from '../core/utils/setupInitData';
import {SavingFutureWalletFailed} from '../core/utils/errors';

type FutureFactoryConfig = Pick<PublicRelayerConfig, 'supportedTokens' | 'factoryAddress' | 'ensAddress' | 'walletContractAddress' | 'relayerAddress' | 'fallbackHandlerAddress'>;

export class FutureWalletFactory {
  constructor(
    private config: FutureFactoryConfig,
    private ensService: ENSService,
    private sdk: UniLoginSdk,
    private balanceChecker: BalanceChecker,
  ) {
  }

  createFrom(wallet: SerializableFutureWallet): FutureWallet {
    return new FutureWallet(wallet, this.sdk, this.ensService, this.config.relayerAddress, this.config.fallbackHandlerAddress, this.balanceChecker);
  }

  private getKeyPair() {
    return createKeyPair();
  }

  async createNew(ensName: string, gasPrice: string, gasToken: string, email?: string): Promise<FutureWallet> {
    const {privateKey, publicKey} = this.getKeyPair();
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
    return this.createFrom({privateKey, contractAddress, ensName, gasPrice, gasToken, email});
  }

  async createNewWithPassword({ensName, code, email}: SerializableConfirmedWallet, gasPrice: string, gasToken: string, password: string) {
    const futureWallet = await this.createNew(ensName, gasPrice, gasToken, email);
    const wallet = new Wallet(futureWallet.privateKey);
    const storedEncryptedWallet: StoredEncryptedWallet = {
      email,
      ensName,
      walletJSON: JSON.parse(await wallet.encrypt(password)),
      contractAddress: futureWallet.contractAddress,
      publicKey: wallet.address,
    };
    await this.sdk.relayerApi.storeEncryptedWallet(storedEncryptedWallet, code);
    return futureWallet;
  }
}
