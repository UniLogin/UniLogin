import {waitToBeMined, sleep} from 'universal-login-commons';
import Token from './Token.json';
import Relayer from 'universal-login-relayer';
import {utils, Contract, providers, Wallet} from 'ethers';

export declare interface DevelopmentRelayerConfig {
  legacyENS: boolean;
  jsonRpcUrl: string;
  port: string;
  privateKey: string;
  chainSpec: {
    ensAddress: string;
    chainId: number;
  };
  ensRegistrars: string[];
  tokenContractAddress: string;
  tokenPrivateKey: string;
  etherPrivateKey: string;
}

declare interface Transaction {
  hash: string;
}

class DevelopmentRelayer extends Relayer {
  private tokenContractAddress: string | undefined;
  private tokenContract: Contract | undefined;
  private tokenWallet: Wallet;
  private etherWallet: Wallet;

  constructor(config: DevelopmentRelayerConfig, provider?: providers.Provider) {
    super(config, provider);
    this.tokenWallet = new Wallet(config.tokenPrivateKey, this.provider);
    this.etherWallet = new Wallet(config.etherPrivateKey, this.provider);
    if (config.tokenContractAddress) {
      this.tokenContractAddress = config.tokenContractAddress;
      this.tokenContract = new Contract(this.tokenContractAddress, Token.interface, this.tokenWallet);
    }
    this.addHooks();
  }

  addHooks() {
    const tokenAmount = utils.parseEther('100');
    const etherAmount = utils.parseEther('100');
    this.hooks.addListener('created', async (transaction: Transaction) => {
      const receipt = await waitToBeMined(this.provider, transaction.hash);
      if (receipt.status) {
        if (this.tokenContract) {
          await this.tokenContract.transfer(receipt.contractAddress, tokenAmount);
        }
        const transaction = {
          to: receipt.contractAddress,
          value: etherAmount
        };
        await this.etherWallet.sendTransaction(transaction);
      }
    });
  }
}

export {DevelopmentRelayer};
