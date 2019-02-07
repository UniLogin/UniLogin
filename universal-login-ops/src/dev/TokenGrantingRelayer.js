const {waitToBeMined} = require('universal-login-contracts');
const Token = require('../../build/Token');
const Relayer = require('universal-login-relayer').default;
const {utils, Contract} = require('ethers');

class TokenGrantingRelayer extends Relayer {
  constructor(config, database, provider = '') {
    super(config, database, provider);
    this.tokenContractAddress = config.tokenContractAddress;
    this.tokenContract = new Contract(this.tokenContractAddress, Token.interface, this.wallet);
    this.addHooks();
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
      const receipt = await waitToBeMined(this.provider, transaction.hash);
      if (receipt.status) {
        this.tokenContract.transfer(transaction.to, utils.parseEther('15'));
      }
    });
  }
}

module.exports = TokenGrantingRelayer;
