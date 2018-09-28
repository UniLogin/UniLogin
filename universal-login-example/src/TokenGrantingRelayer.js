import { waitForContractDeploy } from "./utils";
import Token from '../build/Token';
import Relayer from 'universal-login-relayer';
import ethers, {Wallet} from 'ethers';

class TokenGrantingRelayer extends Relayer {

  constructor(provider, config, deployerPrivateKey, tokenContractAddress = []) {
    super(provider, config);
    this.provider = provider;
    this.tokenContractAddress = tokenContractAddress;
    this.deployerWallet = new Wallet(deployerPrivateKey, this.provider);
  }

  addHooks() {
    this.tokenContract = new ethers.Contract(this.tokenContractAddress, Token.interface, this.deployerWallet);
    this.hooks.addListener('created', (transaction) => {
      waitForContractDeploy(this.provider, Token, transaction.hash)
        .then((identityContract) => {
          this.identityAddress = identityContract.address;
          this.tokenContract.transfer(identityContract.address, 20);});
    });
    this.hooks.addListener('added', (key) => this.tokenContract.transfer(this.identityAddress, 5));
  }
}

export default TokenGrantingRelayer;
