import {waitToBeMined} from 'universal-login-contracts';
import Token from '../../build/Token';
import Relayer from 'universal-login-relayer';
import {utils, Contract} from 'ethers';


class TokenGrantingRelayer extends Relayer {
  constructor(config, database, provider = '') {
    super(config, database, provider);
    this.tokenContractAddress = config.tokenContractAddress;
    this.tokenContract = new Contract(this.tokenContractAddress, Token.interface, this.wallet);
  }

  addHooks() {
    this.hooks.addListener('created', async (transaction) => {
      const receipt = await waitToBeMined(this.provider, transaction.hash);
      if (receipt.status) {
        this.tokenContract.transfer(receipt.contractAddress, utils.parseEther('100'));
      }
    });

    this.addKeySubscription = this.hooks.addListener('added', async (transaction) => {
      const receipt = await waitToBeMined(this.provider, transaction.hash);
      if (receipt.status) {
        this.tokenContract.transfer(transaction.to, utils.parseEther('5'));
      }
    });

    this.addKeysSubscription = this.hooks.addListener('keysAdded', async (transaction) => {
      const recepit = await waitToBeMined(this.provider, transaction.hash);
      if (recepit.status) {
        this.tokenContract.transfer(transaction.to, utils.parseEther('15'));
      }
    });
  }
}

export default TokenGrantingRelayer;
