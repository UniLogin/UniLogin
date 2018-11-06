import {EventEmitter} from 'fbemitter';
import EthereumIdentitySDK from 'universal-login-sdk';
import ethers from 'ethers';
import config, {clickerContractAddress, tokenContractAddress} from '../../config/config';
import IdentityService from './IdentityService';
import ClickerService from './ClickerService';
import EnsService from './EnsService';
import AuthorisationService from './AuthorisationService';
import TokenService from './TokenService';
import IdentitySelectionService from './IdentitySelectionService';
import BackupService from './BackupService';
import GreetingService from './GreetingService';
import StorageService from './StorageService';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';


class Services {
  constructor() {
    this.config = config;
    this.defaultPaymentOptions = DEFAULT_PAYMENT_OPTIONS;
    this.emitter = new EventEmitter();
    this.provider = new ethers.providers.JsonRpcProvider(this.config.jsonRpcUrl);
    this.sdk = new EthereumIdentitySDK(this.config.relayerUrl, this.provider);
    this.ensService = new EnsService(this.sdk, this.provider);
    this.tokenService = new TokenService(tokenContractAddress, this.provider);
    this.storageService = new StorageService();
    this.identityService = new IdentityService(this.sdk, this.emitter, this.storageService, this.provider);
    this.backupService = new BackupService(this.identityService);
    this.clickerService = new ClickerService(this.identityService, clickerContractAddress, this.provider, this.ensService, tokenContractAddress, this.defaultPaymentOptions);
    this.authorisationService = new AuthorisationService(this.sdk, this.emitter);
    this.identitySelectionService = new IdentitySelectionService(this.sdk, config.ensDomains);
    this.greetingService = new GreetingService(this.provider);
  }

  start() {
    this.sdk.start();
    return this.identityService.loadIdentity();
  }

  stop() {
    this.sdk.stop();
  }
}

export default Services;
