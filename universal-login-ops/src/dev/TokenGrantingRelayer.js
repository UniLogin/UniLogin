const {waitToBeMined} = require('universal-login-relayer');
const Token = require('../../build/Token');
const Relayer = require('universal-login-relayer').default;
const {Wallet, utils, Contract} = require('ethers');

class TokenGrantingRelayer extends Relayer {
  constructor(config, provider = '', database) {
    super(config, provider, database);
    this.deployerPrivateKey = config.privateKey;
    this.tokenContractAddress = config.tokenContractAddress;
    this.deployerWallet = new Wallet(this.deployerPrivateKey, this.provider);
  }

  addHooks() {
    this.tokenContract = new Contract(this.tokenContractAddress, Token.interface, this.deployerWallet);
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

module.exports = TokenGrantingRelayer;
