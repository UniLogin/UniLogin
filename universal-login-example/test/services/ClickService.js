import chai, {expect} from 'chai';
import Clicker from '../../build/Clicker';
import {getLogs} from '../utils';
import WalletService from '../../src/services/WalletService';
import ClickService from '../../src/services/ClickService';
import {EventEmitter} from 'events';
import {utils} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import basicContracts from '../fixtures/basicContracts';
import setupSdk from '../helpers/setupSdk';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import FakeStorageService from '../fakes/FakeStorageService';

chai.use(sinonChai);

describe('ClickService', () => {
  let clickService;
  let walletContractService;
  let provider;
  let clickerContract;
  let tokenContract;
  let defaultPaymentOptions;
  let relayer;
  let sdk;

  beforeEach(async () => {
    ({relayer, sdk, provider} = await setupSdk());
    ({clickerContract, tokenContract} = await createFixtureLoader(provider)(basicContracts));
    walletContractService = new WalletService(sdk, new EventEmitter(), new FakeStorageService(), {});
    await walletContractService.createWallet('kyle.mylogin.eth');
    await tokenContract.transfer(walletContractService.walletContract.address, utils.parseEther('1.0'));
    clickService = new ClickService(walletContractService, {clicker: clickerContract.address, token: tokenContract.address}, defaultPaymentOptions);
  });


  it('clicks', async () => {
    const callback = sinon.spy();
    await clickService.click(callback);
    const logs = await getLogs(provider, clickerContract.address, Clicker, 'ButtonPress');
    expect(logs[0]).to.deep.include({presser: walletContractService.walletContract.address});
    expect(callback).to.have.been.called;
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
