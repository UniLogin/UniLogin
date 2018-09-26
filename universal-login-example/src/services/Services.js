import {EventEmitter} from 'fbemitter';
import EthereumIdentitySDK from 'universal-login-sdk';
import ethers from 'ethers';
import config from '../../config/config';
import IdentityService from './IdentityService';
import ClickerService from './ClickerService';
import EnsService from './EnsService';
import {clickerContractAddress, tokenContractAddress} from '../../config/config';
import AuthorisationService from './AuthorisationService';
import TokenService from './TokenService';

class Services {
  constructor() {
    this.config = config;
    this.emitter = new EventEmitter();
    this.provider = new ethers.providers.JsonRpcProvider(this.config.jsonRpcUrl);
    this.sdk = new EthereumIdentitySDK(this.config.relayerUrl, this.provider);
    this.ensService = new EnsService(this.sdk, this.provider);
    this.tokenService = new TokenService(tokenContractAddress, this.provider);
    this.identityService = new IdentityService(this.sdk, this.emitter, tokenContractAddress, this.tokenService);
    this.clickerService = new ClickerService(this.identityService, clickerContractAddress, this.provider, this.ensService);
    this.authorisationService = new AuthorisationService(this.sdk, this.emitter);
  }

  start() {
    this.sdk.start();
  }

  stop() {
    this.sdk.stop();
  }
}

export default Services;
