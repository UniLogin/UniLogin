import {ethers, Wallet, utils, providers} from 'ethers';
import {ensureNotFalsy, DEFAULT_GAS_LIMIT} from '@unilogin/commons';
import {TransactionHashNotFound} from '../core/utils/errors';
import {DeployedWallet} from './wallet/DeployedWallet';

export class SdkSigner extends ethers.Signer {
  private wallet: Wallet;
  provider: providers.Provider;

  constructor(
    private deployedWallet: DeployedWallet,
  ) {
    super();
    this.provider = deployedWallet.sdk.provider;
    this.wallet = new Wallet(this.deployedWallet.privateKey, this.provider);
  }

  async getAddress() {
    return this.wallet.address;
  }

  async signMessage(message: utils.Arrayish) {
    return this.wallet.signMessage(message);
  }

  async sendTransaction(transaction: providers.TransactionRequest) {
    const message: any = {
      from: this.deployedWallet.contractAddress,
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
    const execution = await this.deployedWallet.execute({gasLimit: DEFAULT_GAS_LIMIT, ...message});
    const {transactionHash} = await execution.waitToBeSuccess();
    ensureNotFalsy(transactionHash, TransactionHashNotFound);
    return this.provider.getTransaction(transactionHash!);
  }
}
