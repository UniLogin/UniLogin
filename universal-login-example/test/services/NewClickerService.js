import chai, {expect} from 'chai';
import ClickerService from '../../src/services/ClickerService';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import Clicker from '../../build/Clicker';
import Token from '../../build/Token';
import ERC1077 from 'universal-login-contracts/build/ERC1077'
import {addressToBytes32} from '../utils';
import EnsService from '../../src/services/EnsService';
import IdentityService from '../../src/services/IdentityService';
import {RelayerUnderTest} from 'universal-login-relayer';
import UniversalLoginSDK from 'universal-login-sdk';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { EventEmitter } from 'events';
import {utils} from 'ethers';
import {getLogs} from '../utils';

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
  let clickerService;
  let identityService;
  let provider;
  let clickerContract;
  let walletContract;
  let ensService;
  let tokenContract;
  let defaultPaymentOptions;
  let wallet;
  let relayer;

  beforeEach(async () => {
    provider = createMockProvider();
    relayer = await RelayerUnderTest.createPreconfigured(provider);
    await relayer.start();
    ({provider} = relayer);
    [wallet] = await getWallets(provider);
    const key = addressToBytes32(wallet.address);
    clickerContract = await deployContract(wallet, Clicker);
    tokenContract = await deployContract(wallet, Token);
    const sdk = new UniversalLoginSDK(relayer.url(), provider);
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
