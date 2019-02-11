import {waitToBeMined} from 'universal-login-contracts';
import Token from '../contracts/Token.json';
import Relayer from 'universal-login-relayer';
import {utils, Contract} from 'ethers';

class DevelopmentRelayer extends Relayer {
  constructor(config, provider = '') {
    super(config, provider);
    this.tokenContractAddress = config.tokenContractAddress;
    this.tokenContract = new Contract(this.tokenContractAddress, Token.interface, this.wallet);
    this.addHooks();
  }

  addHooks() {
    const tokenAmount = utils.parseEther('100');
    const etherAmount = utils.parseEther('100');
    this.hooks.addListener('created', async (transaction) => {
      const receipt = await waitToBeMined(this.provider, transaction.hash);
      if (receipt.status) {
        const tokenTransaction = await this.tokenContract.transfer(receipt.contractAddress, tokenAmount);
        await waitToBeMined(this.provider, tokenTransaction.hash);
        const transaction = {
          to: receipt.contractAddress,
          value: etherAmount
        };
        await this.wallet.sendTransaction(transaction);
      }
    });
  }
}

module.exports = DevelopmentRelayer;
