import {expect} from 'chai';
import sinon from 'sinon';
import EnsNameService from '../../src/services/EnsNameService';
import {getWallets, createMockProvider} from 'ethereum-waffle';


describe('EnsNameService', () => {
  let provider;
  let ensNameService;
  let wallet;
  let historyService;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    provider.lookupAddress = sinon.fake.returns('alice.mylogin.eth');
    historyService =  {
      pressers: [{address: wallet.address, name: wallet.address}]
    };
    ensNameService = new EnsNameService(historyService, provider);
  });


  it('getENSName works', async () => {
    expect(await ensNameService.getEnsName(wallet.address)).to.eq('alice.mylogin.eth');
  });

  it('changePressersName works', async () => {
    expect(historyService.pressers[0].name).to.eq(wallet.address);
    await ensNameService.changePressersName();
    expect(historyService.pressers[0].name).to.eq('alice.mylogin.eth');
  });
});
