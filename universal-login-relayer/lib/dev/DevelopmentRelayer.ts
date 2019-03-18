import {waitToBeMined} from 'universal-login-commons';
import Token from './Token.json';
import Relayer from 'universal-login-relayer';
import {utils, Contract, providers} from 'ethers';
import {isContract} from '../utils/utils';

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
}

declare interface Transaction {
  hash: string;
}

class DevelopmentRelayer extends Relayer {
  private tokenContractAddress: string | undefined;
  private tokenContract: Contract | undefined;

  constructor(config: DevelopmentRelayerConfig, provider?: providers.Provider) {
    super(config, provider);
    if (config.tokenContractAddress) {
      this.tokenContractAddress = config.tokenContractAddress;
      this.tokenContract = new Contract(this.tokenContractAddress, Token.interface, this.wallet);
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
          const tokenTransaction = await this.tokenContract.transfer(receipt.contractAddress, tokenAmount);
          await waitToBeMined(this.provider, tokenTransaction.hash);
        }
        const transaction = {
          to: receipt.contractAddress,
          value: etherAmount
        };
        if (await isContract(this.provider, receipt.contractAddress)) {
          await this.wallet.sendTransaction(transaction);
        }
      }
    });
  }
}

export {DevelopmentRelayer};
