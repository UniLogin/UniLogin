import UniversalLoginSDK from './sdk';
import {ethers, Wallet, utils, providers} from 'ethers';
import {ensureNotFalsy, DEFAULT_GAS_LIMIT} from '@unilogin/commons';
import {TransactionHashNotFound} from '../core/utils/errors';

export class SdkSigner extends ethers.Signer {
  private wallet: Wallet;
  provider: providers.Provider;

  constructor(
    private sdk: UniversalLoginSDK,
    public contractAddress: string,
    privateKey: string,
  ) {
    super();
    this.provider = sdk.provider;
    this.wallet = new Wallet(privateKey, this.provider);
  }

  async getAddress(): Promise<string> {
    return this.wallet.address;
  }

  async signMessage(message: utils.Arrayish) {
    return this.wallet.signMessage(message);
  }

  async sendTransaction(transaction: providers.TransactionRequest) {
    const message: any = {
      from: this.contractAddress,
    };
    if (transaction.to !== undefined) {
      message.to = await transaction.to;
    }
    if (transaction.data !== undefined) {
      message.data = await transaction.data;
    }
    if (transaction.gasLimit !== undefined) {
      message.gasLimit = await transaction.gasLimit;
    }
    if (transaction.gasPrice !== undefined) {
      message.gasPrice = await transaction.gasPrice;
    }
    if (transaction.value !== undefined) {
      message.value = await transaction.value;
    }
    const execution = await this.sdk.execute({gasLimit: DEFAULT_GAS_LIMIT, ...message}, this.wallet.privateKey);
    const {transactionHash} = await execution.waitToBeSuccess();
    ensureNotFalsy(transactionHash, TransactionHashNotFound);
    return this.provider.getTransaction(transactionHash!);
  }
}
