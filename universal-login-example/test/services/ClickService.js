import chai, {expect} from 'chai';
import Clicker from '../../build/Clicker';
import {getLogs} from '../utils';
import IdentityService from '../../src/services/IdentityService';
import ClickService from '../../src/services/ClickService';
import {EventEmitter} from 'events';
import {utils} from 'ethers';
import TestHelper from 'universal-login-contracts/test/testHelper';
import basicContracts from '../fixtures/basicContracts';
import setupSdk from '../helpers/setupSdk';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import FakeStorageService from '../fakes/FakeStorageService';

chai.use(sinonChai);

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
    ({clickerContract, tokenContract} = await testHelper.load(basicContracts));
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
