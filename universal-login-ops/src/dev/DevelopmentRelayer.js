const {waitToBeMined} = require('universal-login-contracts');
const Token = require('../contracts/Token.json');
const Relayer = require('universal-login-relayer').default;
const {utils, Contract} = require('ethers');

class DevelopmentRelayer extends Relayer {
  constructor(config, database, provider = '') {
    super(config, database, provider);
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
