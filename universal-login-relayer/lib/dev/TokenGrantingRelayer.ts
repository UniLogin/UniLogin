import {waitToBeMined} from '@universal-login/commons';
import Token from './Token.json';
import Relayer from '../relayer';
import {utils, Contract, providers} from 'ethers';
import {Config} from '../config/relayer';

interface TokenGrantingRelayerCongig extends Config {
  tokenContractAddress : string;
}

class TokenGrantingRelayer extends Relayer {
  private readonly tokenContractAddress : string;
  private tokenContract : Contract;

  constructor(config : TokenGrantingRelayerCongig, provider? : providers.Provider) {
    super(config, provider);
    this.tokenContractAddress = config.tokenContractAddress;
    this.tokenContract = new Contract(this.tokenContractAddress, Token.interface, this.wallet);
    this.addHooks();
  }

  addHooks() {
    this.hooks.addListener('created', async (transaction : utils.Transaction) => {
      const receipt = await waitToBeMined(this.provider, transaction.hash as string);
      if (receipt.status) {
        this.tokenContract.transfer(receipt.contractAddress, utils.parseEther('100'));
      }
    });

    this.hooks.addListener('added', async (transaction : utils.Transaction) => {
      const receipt = await waitToBeMined(this.provider, transaction.hash as string);
      if (receipt.status) {
        this.tokenContract.transfer(transaction.to, utils.parseEther('5'));
      }
    });

     this.hooks.addListener('keysAdded', async (transaction : utils.Transaction) => {
      const receipt = await waitToBeMined(this.provider, transaction.hash as string);
      if (receipt.status) {
        this.tokenContract.transfer(transaction.to, utils.parseEther('15'));
      }
    });
  }
}

export {TokenGrantingRelayer};
