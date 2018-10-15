import {waitForContractDeploy} from "./utils";
import Token from '../build/Token';
import Relayer from 'universal-login-relayer';
import ethers, {Wallet, utils} from 'ethers';

class TokenGrantingRelayer extends Relayer {

  constructor(provider, config, deployerPrivateKey, tokenContractAddress = []) {
    super(provider, config);
    this.provider = provider;
    this.tokenContractAddress = tokenContractAddress;
    this.deployerWallet = new Wallet(deployerPrivateKey, this.provider);
  }

  addHooks() {
    this.tokenContract = new ethers.Contract(this.tokenContractAddress, Token.interface, this.deployerWallet);
    this.hooks.addListener('AddressGenerated', async (identityData) => {
      this.identityAddress = identityData.address;

      const walletNonce = await this.deployerWallet.getTransactionCount();

      this.giftTokens(this.identityAddress, walletNonce);

    });
    this.addKeySubscription = this.hooks.addListener('added', (key) => {
      this.tokenContract.transfer(this.identityAddress, utils.parseEther('5'));
      this.addKeySubscription.remove();
    });
    this.addKeysSubscription = this.hooks.addListener('keysAdded', (key) => {
      this.tokenContract.transfer(this.identityAddress, utils.parseEther('15'));
      this.addKeysSubscription.remove();
    });
  }

  giftTokens(identityAddress, nonce) {
    this.tokenContract.transfer(identityAddress, utils.parseEther('100'), {
      nonce
    });
  }

}

export default TokenGrantingRelayer;
