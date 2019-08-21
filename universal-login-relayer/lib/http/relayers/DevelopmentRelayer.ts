import {utils, Contract, providers} from 'ethers';
import {waitToBeMined} from '@universal-login/commons';
import {Config} from '../../config/relayer';
import Token from './abi/Token.json';
import Relayer from './Relayer';

export declare interface DevelopmentRelayerConfig extends Config {
  tokenContractAddress: string;
}

declare interface Transaction {
  hash: string;
}

interface CallbackArgs {
  transaction: Transaction;
  contractAddress: string;
}

class DevelopmentRelayer extends Relayer {
  private tokenContractAddress: string;
  private tokenContract: Contract;

  constructor(config: DevelopmentRelayerConfig, provider?: providers.Provider) {
    super(config, provider);
    this.tokenContractAddress = config.tokenContractAddress;
    this.tokenContract = new Contract(this.tokenContractAddress, Token.interface, this.wallet);
    this.addHooks();
  }

  addHooks() {
    const tokenAmount = utils.parseEther('100');
    const etherAmount = utils.parseEther('100');
    this.hooks.addListener('created', async ({transaction, contractAddress}: CallbackArgs) => {
      const receipt = await waitToBeMined(this.provider, transaction.hash);
      if (receipt.status) {
        const tokenTransaction = await this.tokenContract.transfer(contractAddress, tokenAmount);
        await waitToBeMined(this.provider, tokenTransaction.hash);
        const transaction = {
          to: contractAddress,
          value: etherAmount
        };
        await this.wallet.sendTransaction(transaction);
      }
    });
  }
}

export {DevelopmentRelayer};
