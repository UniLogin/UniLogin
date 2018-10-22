import {waitForContractDeploy} from './utils';
import Token from '../../build/Token';
import Relayer from 'universal-login-relayer';
import ethers, {Wallet, utils} from 'ethers';

class TokenGrantingRelayer extends Relayer {
  constructor(provider, config, deployerPrivateKey, tokenContractAddress = []) {
    super(config, provider);
    this.provider = provider;
    this.tokenContractAddress = tokenContractAddress;
    this.deployerWallet = new Wallet(deployerPrivateKey, this.provider);
  }

  addHooks() {
    this.tokenContract = new ethers.Contract(this.tokenContractAddress, Token.interface, this.deployerWallet);
    this.hooks.addListener('created', (transaction) => {
      waitForContractDeploy(this.provider, Token, transaction.hash)
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
