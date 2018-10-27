import {waitForContractDeploy} from './utils';
import Identity from 'universal-login-contracts/build/Identity';
import Token from '../../build/Token';
import Relayer from 'universal-login-relayer';
import ethers, {Wallet, utils} from 'ethers';

class TokenGrantingRelayer extends Relayer {
  constructor(config, provider = '') {
    super(config, provider);
    this.deployerPrivateKey = config.privateKey;
    this.tokenContractAddress = config.tokenContractAddress;
    this.deployerWallet = new Wallet(this.deployerPrivateKey, this.provider);
  }

  addHooks() {
    this.tokenContract = new ethers.Contract(this.tokenContractAddress, Token.interface, this.deployerWallet);
    this.hooks.addListener('created', (transaction) => {
      waitForContractDeploy(this.provider, Identity, transaction.hash)
        .then((identityContract) => {
          this.tokenContract.transfer(identityContract.address, utils.parseEther('100'));
        });
    });
    this.addKeySubscription = this.hooks.addListener('added', (identityAddress) => {
      this.tokenContract.transfer(identityAddress, utils.parseEther('5'));
    });
    this.addKeysSubscription = this.hooks.addListener('keysAdded', (identityAddress) => {
      this.tokenContract.transfer(identityAddress, utils.parseEther('15'));
    });
  }
}

export default TokenGrantingRelayer;
