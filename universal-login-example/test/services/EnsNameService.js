import {expect} from 'chai';
import sinon from 'sinon';
import EnsNameService from '../../src/services/EnsNameService';
import {utils} from 'ethers';
import setupSdk from '../fixtures/setupSdk';
import {getWallets, createMockProvider} from 'ethereum-waffle';


describe('EnsNameService', () => {
  let ensService;
  let provider;
  let ensNameService;
  let wallet;
  let clickerContract;
  let historyService;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    historyService =  {
      pressers: [{address: wallet.address, name: wallet.address}]
    }
    ensService = {
      getEnsName() {
        return 'alice.mylogin.eth';
      }
    }
    ensNameService = new EnsNameService(ensService, historyService);
    ensNameService.subscribe();
  });


  it('getENSName works', async () => {
    expect(await ensNameService.getEnsName(wallet.address)).to.eq('alice.mylogin.eth');
  });

  it('changePressersName works', async () => {
    expect(historyService.pressers[0].name).to.eq(wallet.address);
    await ensNameService.changePressersName();
    expect(historyService.pressers[0].name).to.eq('alice.mylogin.eth');
  });

  afterEach(async () => {
    ensNameService.unsubscribeAll();
  });
});
