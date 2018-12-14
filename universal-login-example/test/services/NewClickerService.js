import {expect} from 'chai';
import Clicker from '../../build/Clicker';
import {getLogs} from '../utils';
import IdentityService from '../../src/services/IdentityService';
import ClickService from '../../src/services/ClickService';
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
  let clickService;
  let identityService;
  let provider;
  let clickerContract;
  let tokenContract;
  let defaultPaymentOptions;
  let relayer;
  let sdk;

  beforeEach(async () => {
    ({provider, relayer, clickerContract, tokenContract, sdk} = await testHelper.load(basicEnviroment));
    identityService = new IdentityService(sdk, new EventEmitter(), new FakeStorageService(), {});
    await identityService.createIdentity('kyle.mylogin.eth');
    await tokenContract.transfer(identityService.identity.address, utils.parseEther('1.0'));
    clickService = new ClickService(identityService, {clicker: clickerContract.address, token: tokenContract.address}, defaultPaymentOptions);
  });


  it('clicks', async () => {
    await clickService.click();
    const logs = await getLogs(provider, clickerContract.address, Clicker, 'ButtonPress');
    expect(logs[0]).to.deep.include({presser: identityService.identity.address});
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
