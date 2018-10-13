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
    this.hooks.addListener('counterfactuallyCreated', async (identityData) => {
      this.identityAddress = identityData.address;

      const walletNonce = await this.deployerWallet.getTransactionCount();

      this._giftTokens(this.identityAddress, walletNonce);
      this._giftEth(this.identityAddress, walletNonce + 1)

    });
    this.hooks.addListener('added', (key) => this.tokenContract.transfer(this.identityAddress, utils.parseEther('5')));
  }

  _giftTokens(identityAddress, nonce) {
    this.tokenContract.transfer(identityAddress, utils.parseEther('100'), {
      nonce
    });
  }

  _giftEth(identityAddress, nonce) {
    const ethersGiftToUser = utils.parseEther('0.1')
    this.deployerWallet.send(identityAddress, ethersGiftToUser, {
      nonce
    });
  }
}

export default TokenGrantingRelayer;
