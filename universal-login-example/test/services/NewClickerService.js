import {expect} from 'chai';
import ClickerService from '../../src/services/ClickerService';
import Clicker from '../../build/Clicker';
import {getLogs} from '../utils';
import EnsService from '../../src/services/EnsService';
import IdentityService from '../../src/services/IdentityService';
import {EventEmitter} from 'events';
import {utils} from 'ethers';
import TestHelper from 'universal-login-contracts/test/testHelper';
import basicEnviroment from '../fixtures/basicEnvironment';


class FakeStorageService {
  constructor() {
    this.identity = {};
  }

  async getIdentity() {
    return this.identity;
  }

  async storeIdentity(identity) {
    this.identity = identity;
  }

  async clearStorage() {
    this.identity = {};
  }
}

describe('TheNewClickerService', () => {
  const testHelper = new TestHelper();
  let clickerService;
  let identityService;
  let provider;
  let clickerContract;
  let ensService;
  let tokenContract;
  let defaultPaymentOptions;
  let relayer;
  let sdk;

  beforeEach(async () => {
    ({provider, relayer, clickerContract, tokenContract, sdk} = await testHelper.load(basicEnviroment));
    identityService = new IdentityService(sdk, new EventEmitter(), new FakeStorageService(), {});
    await identityService.createIdentity('kyle.mylogin.eth');
    await tokenContract.transfer(identityService.identity.address, utils.parseEther('1.0'));
    ensService = new EnsService(sdk, provider);
    clickerService = new ClickerService(identityService, clickerContract.address, provider, ensService, tokenContract.address, defaultPaymentOptions);
  });


  it('clicks', async () => {
    await clickerService.click();
    const logs = await getLogs(provider, clickerContract.address, Clicker, 'ButtonPress');
    expect(logs[0]).to.deep.include({presser: identityService.identity.address});
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
