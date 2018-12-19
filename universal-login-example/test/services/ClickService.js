import chai, {expect} from 'chai';
import Clicker from '../../build/Clicker';
import {getLogs} from '../utils';
import IdentityService from '../../src/services/IdentityService';
import ClickService from '../../src/services/ClickService';
import {EventEmitter} from 'events';
import {utils} from 'ethers';
import TestHelper from 'universal-login-contracts/test/testHelper';
import basicEnviroment from '../fixtures/basicEnvironment';
import setupSdk from '../fixtures/setupSdk';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

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

describe('ClickService', () => {
  let testHelper;
  let clickService;
  let identityService;
  let provider;
  let clickerContract;
  let tokenContract;
  let defaultPaymentOptions;
  let relayer;
  let sdk;

  beforeEach(async () => {
    ({relayer, sdk, provider} = await setupSdk());
    testHelper = new TestHelper(provider);
    ({clickerContract, tokenContract} = await testHelper.load(basicEnviroment));
    identityService = new IdentityService(sdk, new EventEmitter(), new FakeStorageService(), {});
    await identityService.createIdentity('kyle.mylogin.eth');
    await tokenContract.transfer(identityService.identity.address, utils.parseEther('1.0'));
    clickService = new ClickService(identityService, {clicker: clickerContract.address, token: tokenContract.address}, defaultPaymentOptions);
  });


  it('clicks', async () => {
    const callback = sinon.spy();
    await clickService.click(callback);
    const logs = await getLogs(provider, clickerContract.address, Clicker, 'ButtonPress');
    expect(logs[0]).to.deep.include({presser: identityService.identity.address});
    expect(callback).to.have.been.called;
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
